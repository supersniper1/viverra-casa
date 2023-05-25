import os

import socketio
from asgiref.sync import sync_to_async
from django.forms.models import model_to_dict

from api.v1.serializers import FolderSerializer
from users.models import BufferUserSocketModel
from widgets.models import FolderModel

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "Viverabackend.settings")

import django

django.setup()


class FolderNamespace(socketio.AsyncNamespace):
    """
    Folder Namespace
    """

    async def on_get_all_folders(self, sid, data):
        """get all folders from desktop of current User"""
        try:
            socket_session = await sync_to_async(
                BufferUserSocketModel.objects.select_related('user_uuid').get
            )(
                socket_id=sid
            )

            user_folders = await sync_to_async(
                FolderModel.objects.filter
            )(user_uuid=socket_session.user_uuid)

            folders = []
            async for folder in user_folders:
                folders.append(
                    {
                        "uuid": str(folder.uuid),
                        "folder_name": str(folder.folder_name)
                    }
                )
            await self.emit('get_all_folders_answer', data=folders, to=sid)

        except Exception as ex:
            await self.emit('error', data=str(ex), to=sid)

    async def on_post_folder(self, sid, data):
        """Create One folder for current User"""
        try:
            socket_session = await sync_to_async(
                BufferUserSocketModel.objects.select_related('user_uuid').get
            )(
                socket_id=sid
            )

            serializer = FolderSerializer(data=data)
            await sync_to_async(serializer.is_valid)(raise_exception=True)
            serializer.validated_data['user_uuid'] = socket_session.user_uuid

            folder = await sync_to_async(serializer.save)()

            message = {
                "uuid": str(folder.uuid),
                "folder_name": str(folder.folder_name)
            }
            await self.emit('post_folder_answer', data=message, to=sid)

        except Exception as ex:
            await self.emit('error', data=str(ex), to=sid)

    async def on_update_folder(self, sid, data):
        """Update One folder for current User"""
        try:
            folder = await sync_to_async(
                FolderModel.objects.get
            )(uuid=data.get('uuid'))
            serializer = FolderSerializer(folder, data=data, partial=True)
            await sync_to_async(serializer.is_valid)(raise_exception=True)
            data = await sync_to_async(serializer.save)()

            folder = model_to_dict(data)
            folder.pop('user_uuid')
            await self.emit('update_folder_answer', data=folder, to=sid)
        except Exception as ex:
            await self.emit('error', data=str(ex), to=sid)

    async def on_delete_folder(self, sid, data):
        """Delete One folder for current User"""
        try:
            uuid = str(data.get('uuid'))
            data = await sync_to_async(FolderModel.objects.get)(uuid=uuid)
            await sync_to_async(data.delete)()

            response = {
                'message': "folder was successfully deleted"
            }
            await self.emit('delete_folder_answer', data=response, to=sid)
        except Exception as ex:
            await self.emit('error', data=str(ex), to=sid)
