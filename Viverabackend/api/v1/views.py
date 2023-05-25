import logging
import os

import tweepy
from adrf.decorators import api_view
from asgiref.sync import sync_to_async
from django.contrib.auth import login
from dotenv import load_dotenv
from rest_framework import status
from rest_framework.decorators import permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken


from .auth import AuthenticationBackend, get_user_from_token
from .serializers import (AuthenticationSerializer, DesktopSerializer,
                          TestSerializer)


logging.basicConfig(
    filename='main.log',
    filemode='w',
    format='%(asctime)s - %(name)s - %(message)s - %(levelname)s',
)

load_dotenv()

TWEEPY_TOKEN = str(os.getenv('TWEEPY_TOKEN'))


@api_view(['POST'])
@permission_classes([AllowAny, ])
async def async_view_test(request):
    """test twitter tweepy"""
    serializer = TestSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    auth = tweepy.Client(
        TWEEPY_TOKEN
    )
    user = await sync_to_async(auth.get_user)(
        username=serializer.data.get('username')
    )
    print(user)
    session = await sync_to_async(auth.get_users_tweets)(
        user.data.id
    )

    tweets = session.data

    tweets_dict = []
    for tweet in tweets:
        tweets_dict.append(
            [
                [
                    "id",
                    tweet.id
                ],
                [
                    "text",
                    tweet.text
                ]
            ]
        )

    return Response(
        data=tweets_dict,
        status=status.HTTP_200_OK
    )


@api_view(['POST'])
@permission_classes([AllowAny, ])
async def authentication_view(request):
    """Creating a JWT Token from a Discord Token"""
    serializer = AuthenticationSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    token = serializer.data.get('token')

    try:
        discord_user = await get_user_from_token(token)

        discord_user = await sync_to_async(AuthenticationBackend.authenticate)(
            request, discord_user=discord_user
        )

        await sync_to_async(login)(request, discord_user)
        refresh = RefreshToken.for_user(discord_user)
        refresh_access = {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }
        return Response(
            data=refresh_access,
            status=status.HTTP_201_CREATED
        )

    except Exception as ex:
        logging.error('error with add user', exc_info=True)
        message = f"Bad Request Ошибка с добавлением пользователя: {ex}"
        return Response(
            data={"message": message},
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated, ])
async def discorduser(request):
    """Get current user`s data """
    discord_user = await sync_to_async(AuthenticationBackend.get_user)(
        request,
        discord_id=request.user.discord_id
    )
    response = {
        "uuid": str(discord_user.uuid).replace('-', ''),
        "discord_tag": discord_user.discord_tag,
        "email": discord_user.email,
        "avatar": discord_user.avatar,
    }

    return Response(
        data=response,
        status=status.HTTP_200_OK
    )
