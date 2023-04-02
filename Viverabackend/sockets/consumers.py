import json
import logging
from pprint import pprint

import jwt
import socketio
from asgiref.sync import sync_to_async

import os

from django.shortcuts import get_object_or_404

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "Viverabackend.settings")

import django
from django.forms.models import model_to_dict

django.setup()

from .middleware import socket_authentication, create_response

from api.v1.auth import AuthenticationBackend
from api.v1.serializers import WidgetSerializer
from users.models import BufferUserWidgetModel, WidgetModel
from widgets.models import WidgetModel

sio = socketio.AsyncServer(async_mode='asgi', cors_allowed_origins='*')

logger = logging.getLogger(__name__)


class WidgetNamespace(socketio.AsyncNamespace):
    """Widget Namespace"""
    discord_user = None

    async def on_connect(self, sid, environ):
        try:
            bearer_payload = environ.get('HTTP_AUTHORIZATION')
            if bearer_payload:
                user_uuid = await sync_to_async(socket_authentication)(bearer_payload)

                auth_backend = AuthenticationBackend()
                discord_user = await sync_to_async(auth_backend.authenticate)(
                    uuid=user_uuid
                )
                self.discord_user = discord_user
                return await self.send(data='connected', to=sid)

            else:
                response = create_response(
                    f"", 401, {"message": "Authorization not found, Please send valid token in headers"}
                )
                logger.info(f"Response {response}")

                await self.send(data=response, to=sid)
                await self.emit('disconnect')

        except jwt.ExpiredSignatureError:
            response = create_response(f"", 401, {"message": "Authentication token has expired"})
            logger.info(f"Response {response}")

            await self.send(data=response, to=sid)
            await self.emit('disconnect')

        except (jwt.DecodeError, jwt.InvalidTokenError):
            response = create_response(f"", 401, {"message": "Authorization has failed, Please send valid token."})
            logger.info(f"Response {response}")
            await self.send(data=response, to=sid)
            await self.emit('disconnect')

        except Exception as ex:
            logging.error(ex)

            await self.send(data=ex, to=sid)
            await self.emit('disconnect')

    async def on_disconnect(self, sid):
        logger.info('User with sid: %s has been disconnected.', sid)

    async def on_get_all_widgets(self, sid, data):
        """get all widgets from current User"""

        buffer = await sync_to_async(
            lambda: list(
                BufferUserWidgetModel.objects
                .filter(user_uuid=self.discord_user.uuid)
                # .values_list(
                #     'widget_uuid__widget_tag',
                #     'widget_uuid__widget_x',
                #     'widget_uuid__widget_y',
                #     'widget_uuid__widget_size_x',
                #     'widget_uuid__widget_size_y',
                #     'widget_uuid__widgetstwittermodel__tracked_name',
                #     'widget_uuid__widgetsdiscordmodel__tracked_server'
                # )
            )
        )()
        data = [
        ]
        for i in buffer:
            widget_uuid = i.__dict__.get('widget_uuid_id')
            obj = await sync_to_async(
                WidgetModel.objects.get
            )(uuid=widget_uuid)
            data.append(model_to_dict(obj))
        await self.send(data=data, to=sid)

    async def on_post_widget(self, sid, data):
        """Create One Widget for current User"""
        serializer = WidgetSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        data = await sync_to_async(WidgetModel.objects.create)(
            **serializer.data
        )
        uuid = str(data.uuid)
        data = model_to_dict(data)
        data['uuid'] = uuid
        await self.send(data=data, to=sid)

    async def on_update_widget(self, sid, data):
        """Update One Widget for current User"""

    async def on_delete_widget(self, sid, data):
        """Delete One Widget for current User"""
        uuid = str(data.get('uuid'))
        data = await sync_to_async(WidgetModel.objects.get)(uuid=uuid)
        await sync_to_async(data.delete)()
        response = "widget was successfully deleted"
        await self.send(data=response, to=sid)
