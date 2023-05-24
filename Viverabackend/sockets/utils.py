from uuid import UUID

from django.forms.models import model_to_dict


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
