from django.urls import include, path
from rest_framework import routers

from .views import TestView, AuthenticationView

router_v1 = routers.DefaultRouter()

router_v1.register(r'authenticate', AuthenticationView, basename='discordauth')
router_v1.register(r'test', TestView, basename='test_rest')


urlpatterns = [
    path('', include(router_v1.urls)),
]
