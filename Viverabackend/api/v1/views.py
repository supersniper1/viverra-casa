from rest_framework import mixins, status, viewsets
from rest_framework.permissions import AllowAny

from .serializers import TestSerializer


class TestView(viewsets.GenericViewSet, mixins.CreateModelMixin):
    serializer_class = TestSerializer
    permission_classes = [AllowAny, ]
