import base64

import requests
from django.contrib.auth import models
from django.contrib.auth.hashers import make_password

from .default import admin_default_avatar


def get_user_avatar_base64(user) -> str:
    avatar = requests.get(
        'https://cdn.discordapp.com/avatars/{0}/{1}.webp?size=128'.format(
            user["id"],
            user["avatar"]
        ),
        timeout=5
    )
    avatar_b64 = str(base64.b64encode(avatar.content)).replace("'", '')[1:]
    return avatar_b64


class UserOAuth2Manager(models.UserManager):
    def create_user(self, user):
        discord_tag = '%s#%s' % (user.get('username'), user.get('discriminator'))
        new_user = self.create(
            username=user.get('username'),
            discord_id=user.get('id'),
            avatar=get_user_avatar_base64(user),
            discord_tag=discord_tag,
            email=user.get('email') or None,
            is_superuser=False,
            is_staff=False,
            is_active=True,
        )
        return new_user

    def create_superuser(
            self,
            username,
            email=None,
            password=None,
            **extra_fields
    ):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        password = make_password(password)
        discord_tag = '%s#%s' % (username, username)
        new_superuser = self.create(
            username=username,
            email=email or None,
            password=password,
            discord_id=0,
            avatar=admin_default_avatar.replace(' ', ''),
            discord_tag=discord_tag,
            is_superuser=extra_fields.get('is_superuser'),
            is_staff=extra_fields.get('is_staff'),
            is_active=extra_fields.get('is_active'),
        )

        return new_superuser
