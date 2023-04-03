from django.urls import path, include
from rest_framework import routers

from .views import async_view_test, authentication_view, discorduser, testdatabase

router_v1 = routers.DefaultRouter()
# router_v1.register('test', testdatabase, basename='test')

urlpatterns = [
    path('test/', testdatabase, name='test'),
    path('auth/', authentication_view, name='auth'),
    path('discorduser/', discorduser, name='discorduser'),
    path('', include(router_v1.urls)),
]
