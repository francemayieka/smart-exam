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
from .models import User, Course
from .serializers import SignupSerializer, CourseSerializer
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken


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
    serializer = CourseSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_courses(request):
    courses = Course.objects.filter(user=request.user)
    if not courses.exists():
        return Response({'message': 'No courses found.'}, status=status.HTTP_404_NOT_FOUND)
    serializer = CourseSerializer(courses, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def search_course(request, course_code):
    """
    Search for courses based on the course code.
    """
    try:
        courses = Course.objects.filter(user=request.user, course_code__icontains=course_code)
        if not courses.exists():
            return Response({'error': 'No courses found matching the given criteria.'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = CourseSerializer(courses, many=True)
        return Response(serializer.data)
    
    except Exception as e:
        return Response({'error': f'An error occurred: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_course(request, course_code):
    """
    Update an existing course for the authenticated user.
    """
    try:
        course = Course.objects.get(course_code=course_code, user=request.user)
    except Course.DoesNotExist:
        return Response({'error': 'Course not found.'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = CourseSerializer(course, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_course(request, course_code):
    """
    Delete a specific course for the authenticated user.
    """
    try:
        course = Course.objects.get(course_code=course_code, user=request.user)
    except Course.DoesNotExist:
        return Response({'error': 'Course not found.'}, status=status.HTTP_404_NOT_FOUND)
    
    course.delete()
    return Response({'message': 'Course deleted successfully.'}, status=status.HTTP_200_OK)
