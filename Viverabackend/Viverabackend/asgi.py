import os
import socketio

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "Viverabackend.settings")

import django

django.setup()


from django.core.asgi import get_asgi_application

from sockets.routing import sio

django_app = get_asgi_application()
application = socketio.ASGIApp(sio, django_app)
