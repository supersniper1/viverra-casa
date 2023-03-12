from pprint import pprint

from rest_framework import serializers


class TestSerializer(serializers.Serializer):
    """
    get: str
    return: str
    description: Test serializer
    """
    test = serializers.CharField()

    class Meta:
        fields = ('test', )

    def create(self, validated_data):
        print('validated_data:')
        pprint(validated_data)
        return validated_data
