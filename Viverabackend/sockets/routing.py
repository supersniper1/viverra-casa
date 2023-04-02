from .consumers import WidgetNamespace
from .consumers import sio

sio.register_namespace(WidgetNamespace('/widget'))
