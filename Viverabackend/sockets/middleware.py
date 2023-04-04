import json

import jwt
import logging

from django.contrib.auth import get_user_model
from django.http import HttpResponse
from django.shortcuts import get_object_or_404

from Viverabackend import settings
import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "Viverabackend.settings")

import django

django.setup()

UserModel = get_user_model()

logger = logging.getLogger(__name__)


def create_response(request_id, code, message):
    """
    Function to create a response to be sent back via the API
    :param request_id:Id fo the request
    :param code:Error Code to be used
    :param message:Message to be sent via the APi
    :return:Dict with the above given params
    """

    try:
        req = str(request_id)
        data = {"data": message, "code": int(code), "request_id": req}
        return data
    except Exception as creation_error:
        logger.error(f'create_response:{creation_error}')


def socket_authentication(jwt_token):
    """
    Custom middleware handler to check authentication for a user with JWT authentication
    :param jwt_token: jwt Bearer token
    :type jwt_token: bytearray
    :return: HTTP Response if authorization fails, else None
    """
    jwt_token = jwt_token[7:]
    payload = jwt.decode(jwt=jwt_token, key=settings.SECRET_KEY, algorithms=['HS256'])
    user_uuid = payload.get('user_id').replace('-', '')
    return user_uuid
