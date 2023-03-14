from django.db import models


class WidgetModel(models.Model):
    widget_tag = models.CharField(max_length=100)
    widget_x = models.IntegerField()
    widget_y = models.IntegerField()
    widget_size_x = models.IntegerField()
    widget_size_y = models.IntegerField()


class WidgetDiscordModel(WidgetModel):
    tracked_server = models.CharField(max_length=100)


class WidgetsTwitterModel(WidgetModel):
    tracked_name = models.CharField(max_length=100)


class WidgetsNoteModel(WidgetModel):
    text = models.TextField()
