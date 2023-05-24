import os

import socketio
from asgiref.sync import sync_to_async

from api.v1.serializers import (FolderSerializer, TestSerializer,
                                WidgetsPolymorphicSerializer)
from users.models import BufferUserSocketModel
from widgets.models import DesktopModel, FolderModel, WidgetModel

from .tweets import get_tweets_from_username
from .utils import configurate_widget, widgetmodel_ptr_to_widget_uuid

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "Viverabackend.settings")

import django

django.setup()


class WidgetNamespace(socketio.AsyncNamespace):
    """
    Widget Namespace
    """

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
                widgets.append(
                    widgetmodel_ptr_to_widget_uuid(
                        configurate_widget(widget)
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

            widget = widgetmodel_ptr_to_widget_uuid(configurate_widget(data))

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

            widget = widgetmodel_ptr_to_widget_uuid(configurate_widget(data))
            await self.emit('update_widget_answer', data=widget, to=sid)
        except Exception as ex:
            await self.emit('error', data=str(ex), to=sid)

    async def on_delete_widget(self, sid, data):
        """Delete One Widget for current User"""
        try:
            uuid = str(data.get('widget_uuid'))
            data = await sync_to_async(WidgetModel.objects.get)(uuid=uuid)
            await sync_to_async(data.delete)()

            response = {
                'message': "widget was successfully deleted"
            }
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
