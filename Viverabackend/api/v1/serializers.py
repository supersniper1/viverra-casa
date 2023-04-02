from rest_framework import serializers

from users.models import UserModel
from widgets.models import WidgetModel

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


class WidgetSerializer(serializers.ModelSerializer):
    uuid = serializers.ReadOnlyField()

    class Meta:
        model = WidgetModel
        fields = (
            'uuid',
            'widget_tag',
            'widget_x',
            'widget_y',
            'widget_size_x',
            'widget_size_y',
        )
