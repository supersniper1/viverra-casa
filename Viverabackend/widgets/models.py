import uuid

from django.db import models
from polymorphic.models import PolymorphicModel

from users.models import UserModel

class DesktopModel(models.Model):
    """
    This is Desktop models
    for Desktop functions and
    Buffering high load operations
    """
    uuid = models.UUIDField(
        default=uuid.uuid4,
        unique=True,
        primary_key=True,
        editable=False
    )
    user_uuid = models.ForeignKey(
        UserModel,
        on_delete=models.CASCADE,
        related_name='buffer_user'
    )
    desktop_name = models.CharField(max_length=100)


class WidgetModel(PolymorphicModel):
    uuid = models.UUIDField(
        default=uuid.uuid4,
        unique=True,
        primary_key=True,
        editable=False
    )
    widget_tag = models.CharField(max_length=100)
    widget_x = models.IntegerField()
    widget_y = models.IntegerField()
    widget_size_x = models.IntegerField()
    widget_size_y = models.IntegerField()
    z_index = models.IntegerField()
    is_collapsed = models.BooleanField()
    desktop = models.ForeignKey(
        DesktopModel,
        on_delete=models.CASCADE,
        related_name='desktop_widget',
    )

    class Meta:
        verbose_name = "Widget"
        verbose_name_plural = "all_Widgets"


class FolderModel(models.Model):
    """
    This is Folder model
    For keep widgets in
    """
    uuid = models.UUIDField(
        default=uuid.uuid4,
        unique=True,
        primary_key=True,
        editable=False
    )
    widget_uuid = models.ForeignKey(
        WidgetModel,
        on_delete=models.CASCADE,
        related_name='widgets'
    )


class WidgetsDiscordModel(WidgetModel):
    tracked_server = models.CharField(max_length=100)

    class Meta:
        verbose_name = "Discord Widget"
        verbose_name_plural = "Discord Widgets"


class WidgetsTwitterModel(WidgetModel):
    tracked_name = models.CharField(max_length=100)

    class Meta:
        verbose_name = "Twitter Widget"
        verbose_name_plural = "Twitter Widgets"


class WidgetsNoteModel(WidgetModel):
    text = models.TextField()

    class Meta:
        verbose_name = "Note Widget"
        verbose_name_plural = "Note Widgets"



