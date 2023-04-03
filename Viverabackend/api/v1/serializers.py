from rest_framework import serializers

from users.models import UserModel
from widgets.models import WidgetModel, WidgetsNoteModel, WidgetsTwitterModel
from rest_polymorphic.serializers import PolymorphicSerializer

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


class WidgetsNoteSerializer(serializers.ModelSerializer):
    uuid = serializers.ReadOnlyField()

    class Meta:
        model = WidgetsNoteModel
        fields = (
            'uuid',
            'widget_tag',
            'widget_x',
            'widget_y',
            'widget_size_x',
            'widget_size_y',
            'text'
        )

class WidgetsTwitterSerializer(serializers.ModelSerializer):
    uuid = serializers.ReadOnlyField()

    class Meta:
        model = WidgetsTwitterModel
        fields = (
            'uuid',
            'widget_tag',
            'widget_x',
            'widget_y',
            'widget_size_x',
            'widget_size_y',
            'tracked_name'
        )


class TestDatabaseSerializer(serializers.Serializer):
    """
    get: str
    return: str
    description: Test serializer
    """
    widget_tag = serializers.CharField()
    widget_x = serializers.CharField()
    widget_y = serializers.CharField()
    widget_size_x = serializers.CharField()
    widget_size_y = serializers.CharField()
    text = serializers.CharField(required=False)
    tracked_name = serializers.CharField(required=False)

    class Meta:
        fields = (
            'widget_tag',
            'widget_x',
            'widget_y',
            'widget_size_x',
            'widget_size_y',
        )


class WidgetsPolymorphicSerializer(PolymorphicSerializer):
   model_serializer_mapping = {
       WidgetModel: WidgetSerializer,
       WidgetsNoteModel: WidgetsNoteSerializer,
       WidgetsTwitterModel: WidgetsTwitterSerializer
   }