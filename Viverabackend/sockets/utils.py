from uuid import UUID

from asgiref.sync import sync_to_async
from django.forms.models import model_to_dict

from widgets.models import WidgetModel, DesktopModel

from users.models import BufferUserSocketModel


def configurate_widget(widget):
    processed_widget = dict_uuid_to_str(
        model_to_dict(widget)
    )

    processed_widget['resourcetype'] = widget.__class__.__name__
    return processed_widget


def dict_uuid_to_str(object: dict) -> dict:
    for k, v in object.items():
        if type(v) is UUID:
            object[k] = str(v)
    return object


def widgetmodel_ptr_to_widget_uuid(widget):
    widget['widget_uuid'] = str(widget.get('widgetmodel_ptr'))
    widget.pop('widgetmodel_ptr')
    return widget


def widget_desktop_to_z_index_uuid(widget):
    return WidgetModel.objects.filter(desktop=widget.desktop).values_list("uuid", "z_index")


def is_desktop_can_exist(user_uuid):
    desktop_count = DesktopModel.objects.filter(user_uuid=user_uuid).count()
    return desktop_count < 4


def get_desktop_from_sid(sid):
    socket_session = BufferUserSocketModel.objects.select_related(
        'user_uuid'
    ).get(
        socket_id=sid
    )
    user_desktop = DesktopModel.objects.filter(
        user_uuid=socket_session.user_uuid
    )

    return user_desktop
