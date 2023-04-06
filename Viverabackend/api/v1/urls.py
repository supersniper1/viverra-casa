from django.urls import path, include
from rest_framework import routers

from .views import authentication_view, discorduser

router_v1 = routers.DefaultRouter()

urlpatterns = [
    path('auth/', authentication_view, name='auth'),
    path('discorduser/', discorduser, name='discorduser'),
    path('', include(router_v1.urls)),
]
