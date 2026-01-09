from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Course, Lesson, Enrollment, Progress
from .serializers import CourseSerializer, LessonSerializer
from core.models import Student

# GET /api/courses/
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def course_list(request):
    courses = Course.objects.all()
    serializer = CourseSerializer(courses, many=True)
    return Response(serializer.data)


# GET /api/courses/<id>/lessons/
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def course_lessons(request, course_id):
    lessons = Lesson.objects.filter(course_id=course_id)
    serializer = LessonSerializer(lessons, many=True)
    return Response(serializer.data)


# POST /api/enroll/
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def enroll(request):
    course_id = request.data.get("course")
    student = Student.objects.get(user=request.user)
    Enrollment.objects.get_or_create(student=student, course_id=course_id)
    return Response({"message": "Enrolled successfully"})


# POST /api/complete/
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def complete_lesson(request):
    lesson_id = request.data.get("lesson")
    student = Student.objects.get(user=request.user)
    Progress.objects.get_or_create(student=student, lesson_id=lesson_id, completed=True)
    return Response({"message": "Lesson completed"})