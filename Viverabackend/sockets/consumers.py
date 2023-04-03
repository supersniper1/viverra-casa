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
from api.v1.serializers import WidgetSerializer, WidgetsPolymorphicSerializer
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
        widgets_buffer = await sync_to_async(
                BufferUserWidgetModel.objects.filter
        )(user_uuid=self.discord_user.uuid)
        widgets = [

        ]

        async for buffer in widgets_buffer:
            buffer = model_to_dict(buffer)
            widget = await sync_to_async(
                WidgetModel.objects.get
            )(uuid=buffer.get('widget_uuid'))

            widget = model_to_dict(widget)
            widget_uuid = widget.get('widgetmodel_ptr')
            widget['widget_uuid'] = str(widget_uuid)
            widget.pop('widgetmodel_ptr')

            widgets.append(widget)

        await self.send(data=widgets, to=sid)

    async def on_post_widget(self, sid, data):
        """Create One Widget for current User"""
        try:
            serializer = WidgetsPolymorphicSerializer(data=data)
            serializer.is_valid(raise_exception=True)
            data = await sync_to_async(serializer.save)()
            await sync_to_async(BufferUserWidgetModel.objects.create)(
                user_uuid=self.discord_user,
                widget_uuid=data
            )
            widget = model_to_dict(data)
            widget_uuid = widget.get('widgetmodel_ptr')
            widget['widget_uuid'] = str(widget_uuid)
            widget.pop('widgetmodel_ptr')
            await self.send(data=widget, to=sid)
        except Exception as ex:
            await self.send(data=str(ex), to=sid)

    async def on_update_widget(self, sid, data):
        """Update One Widget for current User"""
        serializer = WidgetSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        uuid = str(data.get('uuid'))
        data = await sync_to_async(WidgetModel.objects.filter)(uuid=uuid)
        await sync_to_async(data.update)(**serializer.data)
        await self.send(data=serializer.data, to=sid)

    async def on_delete_widget(self, sid, data):
        """Delete One Widget for current User"""
        uuid = str(data.get('uuid'))
        data = await sync_to_async(WidgetModel.objects.get)(uuid=uuid)
        await sync_to_async(data.delete)()
        response = "widget was successfully deleted"
        await self.send(data=response, to=sid)
