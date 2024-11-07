import random
import string
import os
from django.utils.timezone import now, timedelta
from django.core.mail import send_mail
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.contrib.auth import authenticate
from django.http import JsonResponse
from .models import User
from .serializers import SignupSerializer
from rest_framework import status


def home(request):
    return JsonResponse({'message': 'Welcome to the Smart Exam App'})


def generate_otp():
    """
    Generates a random OTP for password reset.
    """
    return ''.join(random.choices(string.ascii_letters + string.digits, k=8))


@api_view(['POST'])
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
def login(request):
    """
    API view to handle user login.
    """
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(request, username=username, password=password)

    if user:
        return Response({
            'message': f'Welcome, {user.username}!',
            'username': user.username
        }, status=status.HTTP_200_OK)
    
    return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
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
