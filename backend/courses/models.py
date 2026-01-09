from django.db import models
from core.models import Student, Teacher


class Course(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE)

    def __str__(self):
        return self.title


class Lesson(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="lessons")
    title = models.CharField(max_length=200)
    content = models.TextField()
    order = models.IntegerField(default=1)
    class Meta:
        ordering = ["order"]
    

    def __str__(self):
        return self.title


class Enrollment(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ["student", "course"]

        def __str__(self):
            return f"{self.student} enrolled in {self.course}"

class Progress(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    completed = models.BooleanField(default=False)

    class Meta:
        unique_together = ["student", "lesson"]
    def __str__(self):
        return f"{self.student} - {self.lesson} : {'Completed' if self.completed else 'Incomplete'}"