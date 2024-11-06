from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    otp = models.CharField(max_length=8, blank=True, null=True)
    otp_expiry = models.DateTimeField(blank=True, null=True)

    groups = models.ManyToManyField(
        'auth.Group',
        related_name='exam_app_users',
        blank=True,
    )
    
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='exam_app_users_permissions',
        blank=True,
    )

    def __str__(self):
        return self.username
