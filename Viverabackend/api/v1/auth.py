import os

import httpx
from django.contrib.auth.backends import BaseBackend
from django.core.exceptions import ObjectDoesNotExist
from django.shortcuts import get_object_or_404
from dotenv import load_dotenv
from pathlib import Path
from users.models import UserModel

BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent
load_dotenv(os.path.join(BASE_DIR / 'infra', '.env'))

CLIENT_ID = int(os.getenv('CLIENT_ID'))
CLIENT_SECRET = str(os.getenv('CLIENT_SECRET'))


class AuthenticationBackend(BaseBackend):
    """Discord Authorization Backend
    create a new user if such a user does not exist yet
    """
    def authenticate(self, user=None, uuid=None) -> UserModel:
        try:
            if uuid:
                find_user = get_object_or_404(UserModel, uuid=uuid)
                return find_user
            find_user = get_object_or_404(UserModel, discord_id=user.get('id'))

            return find_user
        except:
            new_user = UserModel.objects.create_user(user)
            return new_user

    def get_user(self, discord_id):
        try:
            return UserModel.objects.get(discord_id=discord_id)
        except ObjectDoesNotExist:
            return None


async def get_user_from_token(token: str) -> UserModel:
    """
    :param token:
    :return: CustomUser:
    :description: Get from discord users data
    """
    data = {
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'grant_type': 'authorization_code',
        'code': token,
        'redirect_uri': "http://127.0.0.1:2004/set-token/",
        'scope': "identify",
    }
    headers = {
        'Content-Type': "application/x-www-form-urlencoded",
    }

    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.post(
            'https://discord.com/api/oauth2/token',
            data=data,
            headers=headers
        )
        credentials = response.json()
        access_token = credentials['access_token']

        response = await client.get(
                'https://discord.com/api/v9/users/@me',
                headers={"Authorization": "Bearer %s" % access_token}
        )
        user = response.json()
        return user
