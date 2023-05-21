import logging
import os

import jwt
import socketio
from asgiref.sync import sync_to_async
from django.forms.models import model_to_dict
from dotenv import load_dotenv

from api.v1.serializers import TestSerializer, WidgetsPolymorphicSerializer
from users.models import BufferUserSocketModel
from widgets.models import DesktopModel, WidgetModel

from .middleware import create_response, socket_authentication
from .tweets import get_tweets_from_username

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "Viverabackend.settings")

import django

django.setup()

sio = socketio.AsyncServer(
    async_mode='asgi',
    cors_allowed_origins='*',
    logger=True,
    engineio_logger=False
)

load_dotenv()

logger = logging.getLogger(__name__)


class WidgetNamespace(socketio.AsyncNamespace):
    """Widget Namespace"""

    async def on_connect(self, sid, environ):
        """Authentication user and create Session_socket object

        Handle all Errors and return to request On "errror" Event
        """
        try:
            bearer_payload = environ.get('HTTP_AUTHORIZATION')
            if bearer_payload:
                discord_user = await socket_authentication(bearer_payload)
                if discord_user is None:
                    response = create_response(
                        "", 400, {"message": "User Not Found"}
                    )
                    logger.info(f"Response {response}")

                    await self.emit('error', data=response, to=sid)
                    await self.emit('disconnect')
                await sync_to_async(BufferUserSocketModel.objects.create)(
                    user_uuid=discord_user,
                    socket_id=sid
                )
                # await sio.save_session(sid, {'user': user})
                await self.emit('connect_answer', data='Connected', to=sid)
            else:
                response = create_response(
                    "",
                    401,
                    {
                        "message": "Authorization not found, Please send valid token in headers"
                    }
                )
                logger.info(f"Response {response}")

                await self.emit('error', data=response, to=sid)
                await self.emit('disconnect')

        except jwt.ExpiredSignatureError:
            response = create_response("", 401, {"message": "Authentication token has expired"})
            logger.info(f"Response {response}")

            await self.emit('error', data=response, to=sid)
            await self.emit('disconnect')

        except (jwt.DecodeError, jwt.InvalidTokenError):
            response = create_response(
                "",
                401,
                {
                    "message": "Authorization has failed, Please send valid token."
                }
            )
            logger.info(f"Response {response}")
            await self.emit('error', data=response, to=sid)
            await self.emit('disconnect')

        except Exception as ex:
            logging.error(ex)

            await self.emit('error', data=str(ex), to=sid)
            await self.emit('disconnect')

    async def on_disconnect(self, sid):
        """on Disconnect Destroy session object"""
        logger.info('User with sid: %s has been disconnected.', sid)
        socket_session = await sync_to_async(
            BufferUserSocketModel.objects.get
        )(
            socket_id=sid
        )
        await sync_to_async(socket_session.delete)()

    async def on_get_all_widgets(self, sid, data):
        """get all widgets from current User"""
        try:
            socket_session = await sync_to_async(
                BufferUserSocketModel.objects.select_related('user_uuid').get
            )(
                socket_id=sid
            )
            user_desktop = await sync_to_async(
                DesktopModel.objects.filter
            )(user_uuid=socket_session.user_uuid)

            widgets_queryset = await sync_to_async(
                WidgetModel.objects.filter
            )(desktop__in=user_desktop)

            widgets = []
            async for widget in widgets_queryset:
                print(widget.uuid)
                widgets.append(
                    change_widgetmodel_ptr_to_uuid(
                        model_to_dict(widget)
                    )
                )


            await self.emit('get_all_widgets_answer', data=widgets, to=sid)

        except Exception as ex:
            await self.emit('error', data=str(ex), to=sid)

    async def on_post_widget(self, sid, data):
        """Create One Widget for current User"""
        try:
            serializer = WidgetsPolymorphicSerializer(data=data)
            await sync_to_async(serializer.is_valid)(raise_exception=True)
            data = await sync_to_async(serializer.save)()

            widget = change_widgetmodel_ptr_to_uuid(model_to_dict(data))

            await self.emit('post_widget_answer', data=widget, to=sid)

        except Exception as ex:
            await self.emit('error', data=str(ex), to=sid)

    async def on_update_widget(self, sid, data):
        """Update One Widget for current User"""
        try:
            widget = await sync_to_async(
                WidgetModel.objects.get
            )(uuid=data.get('widget_uuid'))

            serializer = WidgetsPolymorphicSerializer(widget, data=data, partial=True)
            await sync_to_async(serializer.is_valid)(raise_exception=True)
            data = await sync_to_async(serializer.save)()

            widget = change_widgetmodel_ptr_to_uuid(model_to_dict(data))
            await self.emit('update_widget_answer', data=widget, to=sid)
        except Exception as ex:
            await self.emit('error', data=str(ex), to=sid)

    async def on_delete_widget(self, sid, data):
        """Delete One Widget for current User"""
        try:
            uuid = str(data.get('widget_uuid'))
            data = await sync_to_async(WidgetModel.objects.get)(uuid=uuid)
            await sync_to_async(data.delete)()

            response = "widget was successfully deleted"
            await self.emit('delete_widget_answer', data=response, to=sid)
        except Exception as ex:
            await self.emit('error', data=str(ex), to=sid)

    async def on_tweets(self, sid, data):
        """Sand new tweets of user"""
        try:
            serializer = TestSerializer(data=data)
            await sync_to_async(serializer.is_valid)(raise_exception=True)
            response = await sync_to_async(get_tweets_from_username)(
                serializer.validated_data.get('username')
            )
            await self.emit('tweets_answer', data=response, to=sid)
        except Exception as ex:
            await self.emit('error', data=str(ex), to=sid)


def change_widgetmodel_ptr_to_uuid(widget: dict) -> dict:
    widget['widget_uuid'] = str(widget.get('widgetmodel_ptr'))
    widget['desktop'] = str(widget.get('desktop'))
    widget['folder'] = str(widget.get('folder'))
    widget.pop('widgetmodel_ptr')
    return widget
