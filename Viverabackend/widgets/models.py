from django.db import models


class Widgets(models.Model):
    widget_tag = models.CharField(max_length=100)
    widget_x = models.IntegerField()
    widget_y = models.IntegerField()
    widget_size_x = models.IntegerField()
    widget_size_y = models.IntegerField()


class WidgetsDiscord(Widgets):
    tracked_server = models.CharField(max_length=100)


class WidgetsTwitter(Widgets):
    tracked_name = models.CharField(max_length=100)


class WidgetsNote(Widgets):
    text = models.TextField()
