from .widget_consumers import WidgetNamespace, sio

sio.register_namespace(WidgetNamespace('/widget'))