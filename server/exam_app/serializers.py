from rest_framework import serializers
from .models import User

class SignupSerializer(serializers.ModelSerializer):
    """
    Serializer for user signup, including the username field.
    """
    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'password']

    def create(self, validated_data):
        # Create the user and set password correctly
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            password=validated_data['password']
        )
        return user
