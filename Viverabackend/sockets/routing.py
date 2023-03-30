import socketio
from .consumers import WidgetNamespace

sio = socketio.AsyncServer(async_mode='asgi', cors_allowed_origins='*')

sio.register_namespace(WidgetNamespace('/widget'))
