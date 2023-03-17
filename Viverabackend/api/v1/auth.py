import os

import requests
from django.contrib.auth.backends import BaseBackend
from django.core.exceptions import ObjectDoesNotExist

from dotenv import load_dotenv

from users.models import UserModel


load_dotenv()

CLIENT_ID = int(os.getenv('CLIENT_ID'))
CLIENT_SECRET = str(os.getenv('CLIENT_SECRET'))


class AuthenticationBackend(BaseBackend):
    """Discord Authorization Backend
    create a new user if such a user does not exist yet
    """
    def authenticate(request, user) -> UserModel:
        find_user = UserModel.objects.filter(discord_id=user['id'])
        if len(find_user) == 0:
            new_user = UserModel.objects.create_new_user(user)
            return new_user
        return find_user

    def get_user(self, user_id):
        try:
            return UserModel.objects.get(discord_id=user_id)
        except ObjectDoesNotExist:
            return None


def get_user_from_token(token: str) -> UserModel:
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
        'redirect_uri': "http://127.0.0.1:8000/api/v1/authenticate/",
        'scope': "identify",
    }
    headers = {
        'Content-Type': "application/x-www-form-urlencoded",
    }
    response = requests.post(
        'https://discord.com/api/oauth2/token',
        data=data,
        headers=headers
    )
    credentials = response.json()
    access_token = credentials['access_token']

    response = requests.get('https://discord.com/api/v9/users/@me', headers={
        "Authorization": "Bearer %s" % access_token
    })
    user = response.json()
    return user