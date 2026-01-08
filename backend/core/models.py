from django.db import models
from django.contrib.auth.models import User

# Student table
class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    roll_number = models.CharField(max_length=20, unique=True)
    department = models.CharField(max_length=100)

    def _str_(self):
        return self.user.username


# Teacher table
class Teacher(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    subject = models.CharField(max_length=100)

    def _str_(self):
        return self.user.username