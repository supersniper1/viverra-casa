from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator
from django.db import models


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
