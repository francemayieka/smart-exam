from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.timezone import now

class User(AbstractUser):
    otp = models.CharField(max_length=8, blank=True, null=True)
    otp_expiry = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return self.username

class Course(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    course_code = models.CharField(max_length=10, unique=True)
    course_name = models.CharField(max_length=100)
    course_outline = models.TextField(blank=True)
    university_name = models.CharField(max_length=100, blank=True)
    university_logo = models.ImageField(upload_to='university_logos/', blank=True)

    def __str__(self):
        return f"{self.course_code} - {self.course_name}"

class Exam(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    exam_name = models.CharField(max_length=100, blank=True, unique=True)
    exam_questions = models.TextField()
    marking_scheme = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.exam_name} for {self.course.course_code}"

    @property
    def university_name(self):
        return self.course.university_name

    @property
    def university_logo(self):
        return self.course.university_logo


class Contact(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField()
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message from {self.name} ({self.email})"
