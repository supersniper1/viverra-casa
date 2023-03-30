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


class WidgetsDiscordModel(WidgetModel):
    tracked_server = models.CharField(max_length=100)


class WidgetsTwitterModel(WidgetModel):
    tracked_name = models.CharField(max_length=100)


class WidgetsNoteModel(WidgetModel):
    text = models.TextField()
