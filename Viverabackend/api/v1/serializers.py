from rest_framework import serializers

from users.models import UserModel


class TestSerializer(serializers.Serializer):
    """
    get: str
    return: str
    description: Test serializer
    """
    username = serializers.CharField()

    class Meta:
        fields = ('username', )


class AuthenticationSerializer(serializers.ModelSerializer):
    """
    get: discord token
    return: JWT token
    description: Create Discord user or authorize
    """
    token = serializers.CharField()

    class Meta:
        model = UserModel
        fields = ('token', )
