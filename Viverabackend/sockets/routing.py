import socketio
from .consumers import WebSocketIoNamespace

sio = socketio.AsyncServer(async_mode='asgi', cors_allowed_origins='*')

sio.register_namespace(WebSocketIoNamespace('/widget'))
