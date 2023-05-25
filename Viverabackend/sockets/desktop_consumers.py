import logging
import os

import socketio
from asgiref.sync import sync_to_async
from django.forms.models import model_to_dict
from dotenv import load_dotenv

from api.v1.serializers import (FolderSerializer, TestSerializer,
                                WidgetsPolymorphicSerializer, DesktopSerializer)
from users.models import BufferUserSocketModel
from widgets.models import DesktopModel, FolderModel, WidgetModel

from .utils import is_desktop_can_exist

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "Viverabackend.settings")

import django

django.setup()


class DesktopNamespace(socketio.AsyncNamespace):
    """
    Desktop Namespace
    """

    async def on_get_all_desktops(self, sid, data):
        """get all desktops from desktop of current User"""
        try:
            socket_session = await sync_to_async(
                BufferUserSocketModel.objects.select_related('user_uuid').get
            )(
                socket_id=sid
            )

            user_desktops = await sync_to_async(
                DesktopModel.objects.filter
            )(user_uuid=socket_session.user_uuid)

            desktops = []
            async for desktop in user_desktops:
                desktops.append(
                    {
                        "uuid": str(desktop.uuid),
                        "desktop_name": str(desktop.desktop_name)
                    }
                )
            await self.emit('get_all_desktops_answer', data=desktops, to=sid)

        except Exception as ex:
            await self.emit('error', data=str(ex), to=sid)

    async def on_post_desktop(self, sid, data):
        """Create One desktop for current User"""
        try:
            socket_session = await sync_to_async(
                BufferUserSocketModel.objects.select_related('user_uuid').get
            )(
                socket_id=sid
            )

            serializer = DesktopSerializer(data=data)
            await sync_to_async(serializer.is_valid)(raise_exception=True)
            serializer.validated_data['user_uuid'] = socket_session.user_uuid
            if not await sync_to_async(is_desktop_can_exist)(socket_session.user_uuid):
                message = {
                    "message": "The desktop limit has been reached"
                }
                await self.emit('error', data=message, to=sid)
            else:
                desktop = await sync_to_async(serializer.save)()

                message = {
                    "uuid": str(desktop.uuid),
                    "desktop_name": str(desktop.desktop_name)
                }
                await self.emit('post_desktop_answer', data=message, to=sid)
        except Exception as ex:
            await self.emit('error', data=str(ex), to=sid)

    async def on_update_desktop(self, sid, data):
        """Update One desktop for current User"""
        try:
            folder = await sync_to_async(
                DesktopModel.objects.get
            )(uuid=data.get('uuid'))
            serializer = DesktopSerializer(folder, data=data, partial=True)
            await sync_to_async(serializer.is_valid)(raise_exception=True)
            data = await sync_to_async(serializer.save)()

            folder = model_to_dict(data)
            folder.pop('user_uuid')
            await self.emit('update_desktop_answer', data=folder, to=sid)
        except Exception as ex:
            await self.emit('error', data=str(ex), to=sid)

    async def on_delete_desktop(self, sid, data):
        """Delete One desktop for current User"""
        try:
            uuid = str(data.get('uuid'))
            data = await sync_to_async(DesktopModel.objects.get)(uuid=uuid)
            await sync_to_async(data.delete)()

            response = {
                'message': "desktop was successfully deleted"
            }
            await self.emit('delete_desktop_answer', data=response, to=sid)
        except Exception as ex:
            await self.emit('error', data=str(ex), to=sid)
