from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

from .models import Student, Teacher
from .serializers import (
    StudentSerializer,
    TeacherSerializer,
    RegisterStudentSerializer,
    RegisterTeacherSerializer
)
from .permissions import IsStudent, IsTeacher


# ================================
# PROTECTED APIs (JWT required)
# ================================

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsStudent])
def students_list(request):
    students = Student.objects.all()
    serializer = StudentSerializer(students, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsTeacher])
def teachers_list(request):
    teachers = Teacher.objects.all()
    serializer = TeacherSerializer(teachers, many=True)
    return Response(serializer.data)


# ================================
# PUBLIC APIs (NO LOGIN REQUIRED)
# ================================

@api_view(['POST'])
@permission_classes([AllowAny])   # 🔥 THIS FIXES YOUR 401 ERROR
def register_student(request):
    serializer = RegisterStudentSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Student registered"})
    return Response(serializer.errors, status=400)


@api_view(['POST'])
@permission_classes([AllowAny])   # 🔥 THIS FIXES YOUR 401 ERROR
def register_teacher(request):
    serializer = RegisterTeacherSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Teacher registered"})
    return Response(serializer.errors, status=400)