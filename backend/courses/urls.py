from django.urls import path
from . import views

urlpatterns = [
    path("courses/", views.course_list),
    path("courses/<int:course_id>/lessons/", views.course_lessons),
    path("enroll/", views.enroll),
    path("complete/", views.complete_lesson),
]