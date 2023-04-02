from django.db import models
import uuid


class WidgetModel(models.Model):
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

    class Meta:
        verbose_name = "Widget"
        verbose_name_plural = "all_Widgets"


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
