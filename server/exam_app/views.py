import random
import string
import os
from django.utils.timezone import now, timedelta
from django.core.mail import send_mail
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.http import JsonResponse
from .models import User, Course, Exam
from .serializers import SignupSerializer, CourseSerializer
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .utils import generate_exam, generate_marking_scheme


def home(request):
    return JsonResponse({'message': 'Welcome to the Smart Learn App'})


def generate_otp():
    """
    Generates a random OTP for password reset.
    """
    return ''.join(random.choices(string.ascii_letters + string.digits, k=8))


@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    """
    API view to handle user signup.
    """
    serializer = SignupSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'Signup successful!'}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(request, username=username, password=password)

    if user:
        # Generate a new refresh token manually
        refresh = RefreshToken()
        refresh['user_id'] = user.id

        # Generate an access token from the new refresh token
        access_token = str(refresh.access_token)

        return Response({
            'message': f'Welcome, {user.username}!',
            'username': user.username,
            'access_token': access_token,
            'refresh_token': str(refresh)
        }, status=status.HTTP_200_OK)

    return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)






@api_view(['POST'])
@permission_classes([AllowAny])
def forgot_password(request):
    """
    API view to handle forgotten password via OTP.
    """
    email = request.data.get('email')

    try:
        user = User.objects.get(email=email)
        otp = generate_otp()
        expiry_time = now() + timedelta(minutes=15)

        # Update user with OTP and expiry time
        user.otp = otp
        user.otp_expiry = expiry_time
        user.save()

        # Send OTP to the user's email
        send_mail(
            'Password Reset OTP',
            f'Your OTP is: {otp}. It will expire in 15 minutes.',
            os.getenv('EMAIL_HOST_USER'),
            [user.email],
            fail_silently=False,
        )

        return Response({'message': 'OTP sent to your email.'}, status=status.HTTP_200_OK)

    except User.DoesNotExist:
        return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['PATCH'])
@permission_classes([AllowAny])
def reset_password(request):
    """
    API view to reset the user's password using OTP.
    """
    email = request.data.get('email')
    otp = request.data.get('otp')
    new_password = request.data.get('new_password')

    try:
        user = User.objects.get(email=email)

        # Check if the OTP is valid and not expired
        if user.otp != otp:
            return Response({'error': 'Invalid OTP.'}, status=status.HTTP_400_BAD_REQUEST)
        if now() > user.otp_expiry:
            return Response({'error': 'OTP has expired.'}, status=status.HTTP_400_BAD_REQUEST)

        # Reset password
        user.set_password(new_password)
        user.otp = None
        user.otp_expiry = None
        user.save()

        return Response({'message': 'Password reset successful.'}, status=status.HTTP_200_OK)

    except User.DoesNotExist:
        return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
    

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_course(request):
    """
    View to add a new course for the authenticated user.
    """
    serializer = CourseSerializer(data=request.data)
    if serializer.is_valid():
        course = serializer.save(user=request.user)
        return Response({
            'course_code': course.course_code,
            'course_name': course.course_name,
            'message': 'Course added successfully.'
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_courses(request):
    """
    View to list all courses for the authenticated user.
    """
    courses = Course.objects.filter(user=request.user)
    if courses.exists():
        serializer = CourseSerializer(courses, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response({'message': 'No courses found.'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_course(request, course_code):
    """
    View to update an existing course.
    """
    try:
        course = Course.objects.get(course_code=course_code, user=request.user)
        serializer = CourseSerializer(course, data=request.data, partial=True)
        if serializer.is_valid():
            updated_course = serializer.save()
            return Response({
                'course_code': updated_course.course_code,
                'updated': True,
                'message': 'Course updated successfully.'
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Course.DoesNotExist:
        return Response({'error': 'Course not found.'}, status=status.HTTP_404_NOT_FOUND)

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Course

from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .models import Course
from .serializers import CourseSerializer
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def search_course(request):
    """
    Search for courses based on a partial or full match of the course code or course name.
    """
    search_query = request.query_params.get('search_query', '')

    if not search_query:
        return Response({'error': 'Search query is required.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Filter courses by course code or course name
        courses = Course.objects.filter(
            Q(course_code__icontains=search_query) | Q(course_name__icontains=search_query),
            user=request.user
        )

        if not courses.exists():
            return Response({'message': 'No courses found matching the given criteria.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = CourseSerializer(courses, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'error': f'An error occurred: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_course(request, course_code):
    """
    View to delete a course.
    """
    try:
        course = Course.objects.get(course_code=course_code, user=request.user)
        course.delete()
        return Response({'message': 'Course deleted successfully.'}, status=status.HTTP_200_OK)
    except Course.DoesNotExist:
        return Response({'error': 'Course not found.'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def add_exam_view(request):
    course_code = request.data.get('course_code')
    exam_name = request.data.get('exam_name')
    exam_questions = request.data.get('exam_questions')
    marking_scheme = request.data.get('marking_scheme')

    if not course_code or not exam_name or not exam_questions:
        return Response({"error": "Course Code, Exam Name, and Exam Questions are required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Fetch the course for the logged-in user
        course = Course.objects.get(user=request.user, course_code=course_code)

        # Create and save the exam record
        exam = Exam.objects.create(
            course=course,
            user=request.user,
            exam_name=exam_name,
            exam_questions=exam_questions,
            marking_scheme=marking_scheme
        )

        return Response({
            "message": "Exam created successfully."
        }, status=status.HTTP_201_CREATED)

    except Course.DoesNotExist:
        return Response({"error": "Course not found."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def list_exams_view(request):
    try:
        # Fetch all exams for the logged-in user
        exams = Exam.objects.filter(user=request.user)

        # Serialize exam data
        exam_data = [
            {
                "exam_name": exam.exam_name,
                "course_code": exam.course.course_code,
                "exam_questions": exam.exam_questions,
                "marking_scheme": exam.marking_scheme,
                "created_at": exam.created_at
            }
            for exam in exams
        ]

        return Response({
            "exams": exam_data,
            "message": "Exams fetched successfully."
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Exam

@api_view(['GET'])
def search_exams_view(request):
    search_query = request.query_params.get('search', '')

    if not search_query:
        return Response({"error": "Search query is required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Search for exams by partial or full match in exam_name
        exams = Exam.objects.filter(user=request.user, exam_name__icontains=search_query)

        if not exams.exists():
            return Response({"message": "No exams found matching the search query."}, status=status.HTTP_404_NOT_FOUND)

        # Serialize exam data
        exam_data = [
            {
                "id": exam.id,
                "exam_name": exam.exam_name,
                "course_code": exam.course.course_code,
                "created_at": exam.created_at
            }
            for exam in exams
        ]

        return Response({
            "exams": exam_data,
            "message": "Exams found successfully."
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



@api_view(['PATCH'])
def update_exam_view(request, exam_name):
    exam_name = request.data.get('exam_name')
    exam_questions = request.data.get('exam_questions')
    number_of_questions = request.data.get('number_of_questions', 0)

    if not exam_name or not exam_questions:
        return Response({"error": "Exam Name and Exam Text are required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Fetch the exam for the logged-in user
        exam = Exam.objects.get(user=request.user, exam_name=exam_name)

        # Update exam fields
        exam.exam_name = exam_name
        exam.exam_questions = exam_questions
        exam.number_of_questions = number_of_questions
        exam.save()

        return Response({
            "message": "Exam updated successfully."
        }, status=status.HTTP_200_OK)

    except Exam.DoesNotExist:
        return Response({"error": "Exam not found."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['DELETE'])
def delete_exam_view(request, exam_name):
    try:
        # Fetch the exam for the logged-in user
        exam = Exam.objects.get(user=request.user, exam_name=exam_name)

        # Delete the exam
        exam.delete()

        return Response({
            "message": "Exam deleted successfully."
        }, status=status.HTTP_200_OK)

    except Exam.DoesNotExist:
        return Response({"error": "Exam not found."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_exam_and_marking_scheme_view(request):
    course_code = request.data.get('course_code')  # Get the course_code from the request
    exam_name = request.data.get('exam_name')  # Get the exam_name from the request

    if not course_code:
        return Response({"error": "Course Code is required."}, status=status.HTTP_400_BAD_REQUEST)

    if not exam_name:
        return Response({"error": "Exam Name is required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Fetch the course for the logged-in user
        course = Course.objects.get(user=request.user, course_code=course_code)

        # Generate the exam text based on the course name and course outline
        exam_questions = generate_exam(course.course_name, course.course_outline)

        # Generate the marking scheme based on the generated exam text
        marking_scheme = generate_marking_scheme(exam_questions)

        # Create and save the exam record
        exam = Exam.objects.create(
            course=course,
            user=request.user,
            exam_name=exam_name,  # Save the provided exam name
            exam_questions=exam_questions,
            marking_scheme=marking_scheme  # Save the generated marking scheme
        )

        return Response({
            "exam_name": exam_name,  # Include exam name in the response
            "exam": exam_questions,
            "marking_scheme": marking_scheme,
            "message": "Exam and marking scheme generated and saved successfully."
        }, status=status.HTTP_200_OK)

    except Course.DoesNotExist:
        return Response({"error": "Course not found."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)







    
