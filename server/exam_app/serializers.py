from rest_framework import serializers
from .models import Course, User, Exam, ContactMessage

class SignupSerializer(serializers.ModelSerializer):
    """
    Serializer for user signup
    """
    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            password=validated_data['password']
        )
        return user
    

class CourseSerializer(serializers.ModelSerializer):
    course_id = serializers.IntegerField(source='id', read_only=True)

    class Meta:
        model = Course
        fields = ['course_id', 'course_code', 'course_name', 'university_name', 'course_outline']

class ExamSerializer(serializers.ModelSerializer):
    exam_id = serializers.IntegerField(source='id', read_only=True)
    course_id = serializers.IntegerField(source='course.id', read_only=True)

    class Meta:
        model = Exam
        fields = ['exam_id', 'course_id', 'course', 'exam_name', 'exam_questions', 'marking_scheme', 'created_at']

class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['id', 'name', 'email', 'message', 'created_at']