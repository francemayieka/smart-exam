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
    uploaded_file = models.FileField(upload_to='course_outlines/', blank=True)

    def __str__(self):
        return f"{self.course_code} - {self.course_name}"

class Exam(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    exam_name = models.CharField(max_length=100, blank=True)
    exam_text = models.TextField()
    number_of_questions = models.IntegerField(default=0)
    marking_scheme = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.exam_name} for {self.course.course_code}"


