import os

import socketio
from django.core.asgi import get_asgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "Viverabackend.settings")

import django

django.setup()

from sockets.routing import sio

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Viverabackend.settings')

django_app = get_asgi_application()
application = socketio.ASGIApp(sio, django_app)
