import os

import socketio
from asgiref.sync import sync_to_async
from django.forms.models import model_to_dict

from api.v1.serializers import DesktopSerializer
from users.models import BufferUserSocketModel
from widgets.models import DesktopModel

from .utils import is_desktop_can_exist, dict_uuid_to_str

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
                    dict_uuid_to_str(model_to_dict(desktop))
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

            if not await sync_to_async(
                    is_desktop_can_exist
            )(socket_session.user_uuid):
                message = {
                    "message": "The desktop limit has been reached"
                }
                await self.emit('error', data=message, to=sid)
            else:
                desktop = await sync_to_async(serializer.save)()

                message = dict_uuid_to_str(model_to_dict(desktop))
                await self.emit('post_desktop_answer', data=message, to=sid)
        except Exception as ex:
            await self.emit('error', data=str(ex), to=sid)

    async def on_update_desktop(self, sid, data):
        """Update One desktop for current User"""
        try:
            desktop = await sync_to_async(
                DesktopModel.objects.get
            )(uuid=data.get('uuid'))
            serializer = DesktopSerializer(desktop, data=data, partial=True)
            await sync_to_async(serializer.is_valid)(raise_exception=True)
            data = await sync_to_async(serializer.save)()

            desktop = model_to_dict(data)
            desktop.pop('user_uuid')
            await self.emit('update_desktop_answer', data=desktop, to=sid)
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
