from django.contrib import admin
from .models import User, Course, Exam, Contact

@admin.register(User)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff')

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ['course_code', 'course_name', 'university_name', 'user']

@admin.register(Exam)
class ExamAdmin(admin.ModelAdmin):
    list_display = ['exam_name', 'course', 'user', 'created_at']

@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'message', 'created_at')