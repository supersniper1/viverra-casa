import uuid

from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator
from django.db import models

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
    email = models.EmailField(
        null=True,
        blank=True
    )
    discord_id = models.IntegerField()
    discord_tag = models.CharField(
        max_length=150,
        verbose_name='Ник В дискорде',
        unique=False,
        validators=[RegexValidator(
            message='Имя пользователя содержит недопустимый символ'
        )]
    )
    avatar = models.CharField(max_length=90000)

    def __str__(self):
        return self.discord_tag

    @property
    def is_authenticated(self):
        return True


class BufferUserSocketModel(models.Model):
    """This is Buffer model
    for Socket io session
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
        related_name='socket_user'
    )

    socket_id = models.CharField(max_length=100)
