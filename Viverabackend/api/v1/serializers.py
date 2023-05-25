from rest_framework import serializers
from rest_polymorphic.serializers import PolymorphicSerializer

from users.models import UserModel
from widgets.models import (DesktopModel, FolderModel, WidgetModel,
                            WidgetsDiscordModel, WidgetsNoteModel,
                            WidgetsTwitterModel)


class TestSerializer(serializers.Serializer):
    """
    get: str
    return: str
    description: Test serializer
    """
    username = serializers.CharField()

    class Meta:
        fields = ('username',)


class AuthenticationSerializer(serializers.ModelSerializer):
    """Create Discord user from token or authorize"""
    token = serializers.CharField()

    class Meta:
        model = UserModel
        fields = ('token',)


class RefreshSerializer(serializers.ModelSerializer):
    """Create Discord user from token or authorize"""
    token = serializers.CharField()

    class Meta:
        model = UserModel
        fields = ('token',)


class DesktopSerializer(serializers.ModelSerializer):

    class Meta:
        model = DesktopModel
        fields = ('desktop_name',)


class FolderSerializer(serializers.ModelSerializer):

    class Meta:
        model = FolderModel
        fields = ('folder_name', )


class WidgetSerializer(serializers.ModelSerializer):
    """Base Widget Serializer"""
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
            'z_index',
            'is_collapsed',
            'desktop',
            'folder',
        )


class WidgetsNoteSerializer(serializers.ModelSerializer):
    """Note widget Serializer"""
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
            'z_index',
            'is_collapsed',
            'text',
            'desktop',
            'folder',
        )


class WidgetsTwitterSerializer(serializers.ModelSerializer):
    """Twitter widget Serializer"""
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
            'z_index',
            'is_collapsed',
            'tracked_name',
            'desktop',
            'folder',
        )


class WidgetsDiscordSerializer(serializers.ModelSerializer):
    """Discord widget Serializer"""
    uuid = serializers.ReadOnlyField()

    class Meta:
        model = WidgetsDiscordModel
        fields = (
            'uuid',
            'widget_tag',
            'widget_x',
            'widget_y',
            'widget_size_x',
            'widget_size_y',
            'z_index',
            'is_collapsed',
            'tracked_server',
            'desktop',
            'folder',
        )


class WidgetsPolymorphicSerializer(PolymorphicSerializer):
    """Base Polymorphic widget Serializer"""
    model_serializer_mapping = {
        WidgetModel: WidgetSerializer,
        WidgetsNoteModel: WidgetsNoteSerializer,
        WidgetsTwitterModel: WidgetsTwitterSerializer,
        WidgetsDiscordModel: WidgetsDiscordSerializer
    }
