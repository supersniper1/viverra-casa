from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator
from django.db import models

from widgets.models import Widgets

class User(AbstractUser):
    """Base User Model"""
    discord_id = models.IntegerField()
    discord_tag = models.CharField(
        max_length=150,
        verbose_name='Ник В дискорде',
        unique=False,
        validators=[RegexValidator(
            regex=r'^[\w.@+-]+$',
            message='Имя пользователя содержит недопустимый символ'
        )]
    )
    avatar = models.CharField(max_length=90000)

    def __str__(self):
        return self.discord_tag

    @property
    def is_authenticated(self):
        return True


class Buffer_user_widget(models.Model):
    """This is Buffer models

    for Buffering high load operations
    TODO: think About CASCADE method in widget_id field
    """
    user_id = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        related_name='buffer_user'
    )
    widget_id = models.OneToOneField(
        Widgets,
        on_delete = models.CASCADE,
    )
