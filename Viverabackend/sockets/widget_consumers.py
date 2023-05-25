import logging
import os
from pathlib import Path

import socketio
from asgiref.sync import sync_to_async

from api.v1.serializers import (FolderSerializer, TestSerializer,
                                WidgetsPolymorphicSerializer)
from dotenv import load_dotenv

from widgets.models import DesktopModel, FolderModel, WidgetModel

from .leveler import leveler_z_index
from .tweets import get_tweets_from_username
from .utils import configurate_widget, widgetmodel_ptr_to_widget_uuid, widget_desktop_to_z_index_uuid, \
    get_desktop_from_sid

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "Viverabackend.settings")

import django

django.setup()

from core.exception.widget_exception import ToLowMaxZIndexException

logger = logging.getLogger(__name__)

BASE_DIR = Path(__file__).resolve().parent.parent.parent
load_dotenv(os.path.join(BASE_DIR / 'infra', '.env'))

MAX_WIDGETS_ON_DESKTOP = int(os.getenv('MAX_WIDGETS_ON_DESKTOP'))
MAX_Z_INDEX_ON_DESKTOP = int(os.getenv('MAX_Z_INDEX_ON_DESKTOP'))

if MAX_WIDGETS_ON_DESKTOP >= MAX_Z_INDEX_ON_DESKTOP:
    raise ToLowMaxZIndexException()


class WidgetNamespace(socketio.AsyncNamespace):
    """
    Widget Namespace
    """

    async def on_get_all_widgets(self, sid, data):
        """get all widgets from current User"""
        try:
            user_desktop = await sync_to_async(get_desktop_from_sid)(sid)

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

            user_desktop = serializer.validated_data.get('desktop')

            widgets_queryset = await sync_to_async(
                WidgetModel.objects.filter
            )(desktop__in=[user_desktop, ])

            widgets_count = await sync_to_async(widgets_queryset.count)()
            if widgets_count >= MAX_WIDGETS_ON_DESKTOP:
                message = {
                    "message": "The limit of widgets on this desktop has been reached"
                }
                await self.emit('post_widget_answer', data=message, to=sid)
            else:
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

            if serializer.validated_data.get('z_index') > MAX_Z_INDEX_ON_DESKTOP - 1:
                z_indexes = await sync_to_async(widget_desktop_to_z_index_uuid)(widget)

                leveled = await sync_to_async(leveler_z_index)(z_indexes)
                for uuid, z_index in leveled.items():
                    widget = await sync_to_async(
                        WidgetModel.objects.get
                    )(uuid=uuid)
                    serializer = WidgetsPolymorphicSerializer(widget, data={"z_index": z_index}, partial=True)
                    await sync_to_async(serializer.is_valid)(raise_exception=True)
                    await sync_to_async(serializer.save)()

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
