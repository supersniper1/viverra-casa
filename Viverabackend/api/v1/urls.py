from django.urls import path
from rest_framework import routers

from .views import async_view_test, authentication_view, discorduser

router_v1 = routers.DefaultRouter()

router_v1.register(r'discorduser', authentication_view, basename='discordauth')


urlpatterns = [

    path('test/', async_view_test, name='test'),
    path('auth/', authentication_view, name='auth'),
    path('discorduser/', discorduser, name='test'),
]
