from django.contrib import admin
from .models import User, Course

@admin.register(User)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff')

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('course_code', 'course_name', 'user', 'date_created', 'last_updated')  # Customize as needed
    search_fields = ('course_code', 'course_name')  # Enable search by course code or name
    list_filter = ('date_created', 'last_updated', 'user')  # Filter by creation date, update date, and user
    ordering = ('course_code',)  # Order by course code by default
    fields = ('user', 'course_code', 'course_name', 'course_outline')  # Specify which fields to display in the form
    readonly_fields = ('date_created', 'last_updated')  # Make date fields readonly since they are auto-managed
