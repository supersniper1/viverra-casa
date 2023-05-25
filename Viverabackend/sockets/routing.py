from .consumers import MainWidgetNamespace, sio

sio.register_namespace(MainWidgetNamespace('/widget'))
