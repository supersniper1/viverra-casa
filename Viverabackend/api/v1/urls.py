from django.urls import path, include
from rest_framework import routers

from .views import authentication_view, discorduser, async_view_test

router_v1 = routers.DefaultRouter()

urlpatterns = [
    path('auth/', authentication_view, name='auth'),
    path('discorduser/', discorduser, name='discorduser'),
    path('test_twitter/', async_view_test, name='test_twitter'),
    path('', include(router_v1.urls)),
]