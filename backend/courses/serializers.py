from rest_framework import serializers
from .models import Course, Lesson, Enrollment, Progress


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = "__all__"


class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = "__all__"


class EnrollmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = "__all__"


class ProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Progress
        fields = "__all__"