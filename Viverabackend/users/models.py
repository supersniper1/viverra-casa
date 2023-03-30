import uuid

from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator
from django.db import models

from widgets.models import WidgetModel

from .manager import UserOAuth2Manager


class UserModel(AbstractUser):
    """Base User Model"""

    objects = UserOAuth2Manager()
    uuid = models.UUIDField(
        default=uuid.uuid4,
        unique=True,
        primary_key=True,
        editable=False
    )
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


class BufferUserWidgetModel(models.Model):
    """This is Buffer models
    for Buffering high load operations
    """
    uuid = models.UUIDField(
        default=uuid.uuid4,
        unique=True,
        primary_key=True,
        editable=False
    )
    user_id = models.ForeignKey(
        UserModel,
        on_delete=models.CASCADE,
        related_name='buffer_user'
    )

    widget_id = models.OneToOneField(
        WidgetModel,
        on_delete=models.CASCADE,
    )
