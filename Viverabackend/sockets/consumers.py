import logging
import os

import jwt
import socketio
from asgiref.sync import sync_to_async
from dotenv import load_dotenv

from users.models import BufferUserSocketModel

from .folder_consumers import FolderNamespace
from .middleware import create_response, socket_authentication
from .widget_consumers import WidgetNamespace

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


class MainWidgetNamespace(WidgetNamespace, FolderNamespace):
    """
    Widget Namespace
    """

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
                else:
                    await sync_to_async(BufferUserSocketModel.objects.create)(
                        user_uuid=discord_user,
                        socket_id=sid
                    )
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
