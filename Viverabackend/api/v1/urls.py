from django.urls import include, path
from rest_framework import routers

from .views import async_view_test, authentication_view, discorduser

router_v1 = routers.DefaultRouter()

urlpatterns = [
    path('auth/', authentication_view, name='auth'),
    path('discorduser/', discorduser, name='discorduser'),
    path('test_twitter/', async_view_test, name='test_twitter'),
    path('', include(router_v1.urls)),
]