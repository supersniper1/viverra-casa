from django.urls import re_path
import consumers

websocket_urlpatterns = [
    re_path(r'ws/socket-server/', consumers.TestConsumer.as_asgi())
]
