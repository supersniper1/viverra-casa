from uuid import UUID

from django.forms.models import model_to_dict

from widgets.models import WidgetModel, DesktopModel


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


def user_desktop_to_z_index_uuid(user_desktop):
    return WidgetModel.objects.filter(desktop__in=user_desktop).values_list("uuid", "z_index")


def is_desktop_can_exist(user_uuid):
    desktop_count = DesktopModel.objects.filter(user_uuid=user_uuid).count()
    return desktop_count < 4
