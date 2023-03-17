import requests
from django.contrib.auth import models
import base64


def get_user_avatar_base64(user) -> str:
    avatar = requests.get(f'https://cdn.discordapp.com/avatars/{user["id"]}/{user["avatar"]}.webp?size=128')
    avatar_b64 = str(base64.b64encode(avatar.content)).replace("'", '')[1:]
    return avatar_b64


class UserOAuth2Manager(models.UserManager):
    def create_new_user(self, user):
        discord_tag = '%s#%s' % (user['username'], user['discriminator'])

        new_user = self.create(
            username=user['username'],
            discord_id=user['id'],
            avatar=get_user_avatar_base64(user),
            discord_tag=discord_tag,
            email=user['email'] or None
        )
        return new_user
