from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from core.models import Student
from core.permissions import IsStudent

from .models import (
    Course, Lesson, Enrollment, Progress,
    Quiz, Question, StudentAnswer
)
from .serializers import CourseSerializer, LessonSerializer


# -----------------------------
# COURSES & ENROLLMENT
# -----------------------------

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def course_list(request):
    courses = Course.objects.all()
    return Response(CourseSerializer(courses, many=True).data)


@api_view(["GET"])
@permission_classes([IsAuthenticated, IsStudent])
def course_lessons(request, course_id):
    student = request.user.student
    lessons = Lesson.objects.filter(course_id=course_id).order_by("order")

    data = []
    for l in lessons:
        unlocked = is_lesson_unlocked(student, l)
        data.append({
            "id": l.id,
            "title": l.title,
            "order": l.order,
            "unlocked": unlocked
        })

    return Response({
        "courses":data
        })


@api_view(["POST"])
@permission_classes([IsAuthenticated, IsStudent])
def enroll(request):
    course_id = request.data.get("course")
    student = request.user.student
    Enrollment.objects.get_or_create(student=student, course_id=course_id)
    return Response({"message": "Enrolled"})


# -----------------------------
# LESSON LOCKING LOGIC
# -----------------------------

def is_lesson_unlocked(student, lesson):
    previous = Lesson.objects.filter(
        course=lesson.course,
        order__lt=lesson.order
    )

    completed = Progress.objects.filter(
        student=student,
        lesson__in=previous,
        completed=True
    ).count()

    return completed == previous.count()


@api_view(["GET"])
@permission_classes([IsAuthenticated, IsStudent])
def lesson_detail(request, lesson_id):
    student = request.user.student
    lesson = get_object_or_404(Lesson, id=lesson_id)

    if not is_lesson_unlocked(student, lesson):
        return Response({"detail": "Locked"}, status=403)

    return Response(LessonSerializer(lesson).data)


@api_view(["GET"])
@permission_classes([IsAuthenticated, IsStudent])
def can_access_lesson(request, lesson_id):
    student = request.user.student
    lesson = get_object_or_404(Lesson, id=lesson_id)

    if not Enrollment.objects.filter(student=student, course=lesson.course).exists():
        return Response({"access": False})

    if lesson.order == 1:
        return Response({"access": True})

    prev = Lesson.objects.filter(
        course=lesson.course,
        order=lesson.order - 1
    ).first()

    done = Progress.objects.filter(
        student=student,
        lesson=prev,
        completed=True
    ).exists()

    return Response({"access": done})


# -----------------------------
# PROGRESS & DASHBOARD (API)
# -----------------------------

@api_view(["GET"])
@permission_classes([IsAuthenticated, IsStudent])
def student_dashboard(request):
    student = request.user.student
    enrollments = Enrollment.objects.filter(student=student)

    data = []

    for e in enrollments:
        lessons = Lesson.objects.filter(course=e.course)
        total = lessons.count()

        completed = Progress.objects.filter(
            student=student,
            lesson__course=e.course,
            completed=True
        ).count()

        percent = int((completed / total) * 100) if total else 0

        data.append({
            "course_id": e.course.id,
            "course": e.course.title,
            "total": total,
            "completed": completed,
            "progress": percent
        })

    return Response(data)


@api_view(["GET"])
@permission_classes([IsAuthenticated, IsStudent])
def course_progress(request, course_id):
    student = request.user.student
    course = get_object_or_404(Course, id=course_id)

    total = Lesson.objects.filter(course=course).count()
    completed = Progress.objects.filter(
        student=student,
        lesson__course=course,
        completed=True
    ).count()

    percent = int((completed / total) * 100) if total else 0

    return Response({
        "course": course.title,
        "completed": completed,
        "total": total,
        "percentage": percent
    })


@api_view(["GET"])
@permission_classes([IsAuthenticated, IsStudent])
def resume_learning(request):
    student = request.user.student
    enrollments = Enrollment.objects.filter(student=student)

    response = []

    for e in enrollments:
        lessons = Lesson.objects.filter(course=e.course).order_by("order")

        completed = Progress.objects.filter(
            student=student,
            lesson__course=e.course,
            completed=True
        ).values_list("lesson_id", flat=True)

        last_done = None
        next_lesson = None

        for l in lessons:
            if l.id in completed:
                last_done = l
            else:
                next_lesson = l
                break

        response.append({
            "course": e.course.title,
            "last_completed": last_done.title if last_done else None,
            "continue_lesson": next_lesson.title if next_lesson else None
        })

    return Response(response)


@api_view(["GET"])
@permission_classes([IsAuthenticated, IsStudent])
def resume_course(request, course_id):
    student = request.user.student
    course = get_object_or_404(Course, id=course_id)

    enrollment = Enrollment.objects.filter(
        student=student, course=course
    ).first()

    if not enrollment:
        return Response(
            {"error": "Not enrolled in this course"},
            status=403
        )

    lessons = Lesson.objects.filter(course=course).order_by("order")

    if not lessons.exists():
        return Response(
            {"error": "No lessons found for this course"},
            status=404
        )

    for lesson in lessons:
        progress = Progress.objects.filter(
            student=student,
            lesson=lesson,
            completed=True
        ).first()

        if not progress:
            return Response({
                "lesson_id": lesson.id,
                "title": lesson.title,
                "order": lesson.order,
                "status": "resume"
            })

    last = lessons.last()
    return Response({
        "lesson_id": last.id,
        "title": last.title,
        "order": last.order,
        "status": "completed"
    })


# -----------------------------
# QUIZ & AUTO PROGRESS
# -----------------------------

@api_view(["POST"])
@permission_classes([IsAuthenticated, IsStudent])
def submit_quiz(request, quiz_id):
    student = request.user.student
    quiz = get_object_or_404(Quiz, id=quiz_id)

    answers = request.data.get("answers", {})
    correct = 0
    total = quiz.questions.count()

    for q in quiz.questions.all():
        selected = answers.get(str(q.id))
        if not selected:
            continue

        selected = selected.upper()
        is_correct = selected == q.correct.upper()

        StudentAnswer.objects.update_or_create(
            student=student,
            question=q,
            defaults={
                "selected": selected,
                "is_correct": is_correct
            }
        )

        if is_correct:
            correct += 1

    score = int((correct / total) * 100)
    passed = score >= 60

    if passed:
        Progress.objects.update_or_create(
            student=student,
            lesson=quiz.lesson,
            defaults={"completed": True}
        )

    return Response({"score": score, "passed": passed})


# -----------------------------
# PHASE-4B — STUDENT DASHBOARD UI
# -----------------------------

@login_required
def student_dashboard_page(request):
    student = request.user.student
    enrollments = Enrollment.objects.filter(student=student)

    dashboard = []

    for e in enrollments:
        lessons = Lesson.objects.filter(course=e.course).order_by("order")

        completed_ids = Progress.objects.filter(
            student=student,
            lesson__course=e.course,
            completed=True
        ).values_list("lesson_id", flat=True)

        total = lessons.count()
        completed = len(completed_ids)
        percent = int((completed / total) * 100) if total else 0

        resume = None
        for l in lessons:
            if l.id not in completed_ids:
                resume = l
                break

        dashboard.append({
            "course": e.course,
            "lessons": lessons,
            "completed_ids": completed_ids,
            "completed": completed,
            "total": total,
            "progress": percent,
            "resume": resume
        })

    return render(request, "courses/student_dashboard.html", {
        "dashboard": dashboard
    })
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from django.http import HttpResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Course, Progress
from core.permissions import IsStudent  # if you have this

@api_view(["GET"])
@permission_classes([IsAuthenticated, IsStudent])
def certificate(request, course_id):
    student = request.user.student
    course = Course.objects.get(id=course_id)

    total = course.lessons.count()
    done = Progress.objects.filter(student=student, lesson__course=course, completed=True).count()

    if done != total:
        return Response({"error": "Course not completed"}, status=403)

    response = HttpResponse(content_type="application/pdf")
    response["Content-Disposition"] = f'attachment; filename="{course.title}_certificate.pdf"'

    p = canvas.Canvas(response, pagesize=A4)
    p.setFont("Helvetica-Bold", 24)
    p.drawString(100, 700, "Certificate of Completion")

    p.setFont("Helvetica", 18)
    p.drawString(100, 650, student.user.username)
    p.drawString(100, 620, f"has completed {course.title}")

    p.save()
    return response
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def mark_lesson_completed(request, lesson_id):
    student = request.user.student
    lesson = Lesson.objects.get(id=lesson_id)

    progress, created = Progress.objects.get_or_create(student=student, lesson=lesson)
    progress.completed = True
    progress.save()

    return Response({"success": True})