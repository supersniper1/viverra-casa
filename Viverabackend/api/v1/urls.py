from django.urls import include, path
from rest_framework import routers

from .views import authentication_view, async_view_test, discorduser

router_v1 = routers.DefaultRouter()

router_v1.register(r'discorduser', authentication_view, basename='discordauth')


urlpatterns = [

    path('test/', async_view_test, name='test'),
    path('auth/', authentication_view, name='auth'),
    path('discorduser/', discorduser, name='test'),
]
