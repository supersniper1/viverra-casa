import logging

from django.contrib.auth import login
from rest_framework import mixins, status, viewsets
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import TestSerializer, AuthenticationSerializer
from .auth import get_user_from_token, AuthenticationBackend

logging.basicConfig(
    filename='main.log',
    filemode='w',
    format='%(asctime)s - %(name)s - %(message)s - %(levelname)s',
)


class TestView(viewsets.GenericViewSet, mixins.CreateModelMixin):
    serializer_class = TestSerializer
    permission_classes = [AllowAny, ]


class AuthenticationView(viewsets.GenericViewSet, mixins.CreateModelMixin, ):
    """Creating a JWT Token from a Discord Token"""
    serializer_class = AuthenticationSerializer
    permission_classes = [AllowAny, ]

    def create(self, request, *args, **kwargs):
        token = request.data.get('token')

        try:
            user = get_user_from_token(token)
            discord_user = AuthenticationBackend.authenticate(request, user=user)
            discord_user = list(discord_user).pop()
            login(request, discord_user)

            refresh = RefreshToken.for_user(discord_user)
            refresh_access = {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }

            response = Response(
                data=refresh_access,
                status=status.HTTP_201_CREATED
            )
        except Exception as ex:
            logging.error('error with add user', exc_info=True)
            message = f"Bad Request Ошибка с добавлением пользователя: {ex}"
            response = Response(
                data={"message": message},
                status=status.HTTP_400_BAD_REQUEST
            )
        finally:
            return response