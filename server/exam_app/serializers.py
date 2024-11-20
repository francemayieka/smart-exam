from rest_framework import serializers
from .models import Course, User, Exam, Contact

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
        fields = ['course_id', 'course_code', 'course_name', 'university_name', 'university_logo', 'course_outline']

class ExamSerializer(serializers.ModelSerializer):
    exam_id = serializers.IntegerField(source='id', read_only=True)
    course_id = serializers.IntegerField(source='course.id', read_only=True)
    course_code = serializers.CharField(source='course.course_code', read_only=True)  # Fetching from the related Course model
    university_name = serializers.CharField(source='course.university_name', read_only=True)  # Fetching from the related Course model
    university_logo = serializers.ImageField(source='course.university_logo', read_only=True)  # Fetching the logo from the related Course model

    class Meta:
        model = Exam
        fields = ['exam_id', 'course_id', 'course_code', 'course', 'exam_name', 'exam_questions', 'marking_scheme', 'created_at', 'university_name', 'university_logo']

class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = ['id', 'name', 'email', 'message', 'created_at']