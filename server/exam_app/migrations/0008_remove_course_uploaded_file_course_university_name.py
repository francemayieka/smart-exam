# Generated by Django 5.1.3 on 2024-11-20 15:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('exam_app', '0007_contactmessage'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='course',
            name='uploaded_file',
        ),
        migrations.AddField(
            model_name='course',
            name='university_name',
            field=models.CharField(blank=True, max_length=100),
        ),
    ]
