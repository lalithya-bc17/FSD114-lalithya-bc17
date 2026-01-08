from django.urls import path
from . import views

urlpatterns = [
    path('students/', views.students_list),
    path('teachers/', views.teachers_list),

    path('register/student/', views.register_student),
    path('register/teacher/', views.register_teacher),
]