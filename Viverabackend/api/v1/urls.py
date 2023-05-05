from django.urls import include, path
from rest_framework import routers

from .views import async_view_test, authentication_view, discorduser, Desktop, DesktopDetail

router_v1 = routers.DefaultRouter()

urlpatterns = [
    path('auth/', authentication_view, name='auth'),
    path('discorduser/', discorduser, name='discord_user'),
    path('desktop/', Desktop.as_view(), name='desktop'),
    path(r'desktop/<str:desktop_uuid>/', DesktopDetail.as_view(), name='desktop_detail'),
    path('test_twitter/', async_view_test, name='test_twitter'),
    path('', include(router_v1.urls)),
]