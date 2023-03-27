import os

import socketio
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application

# from sockets.routing import websocket_urlpatterns
from sockets.consumers import sio

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Viverabackend.settings')

django_app = get_asgi_application()

application = socketio.ASGIApp(sio, django_app)
