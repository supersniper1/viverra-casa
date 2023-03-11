from django.contrib import admin
from django.urls import include, path
from socket.views import test_socket


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include("api.urls")),
]
