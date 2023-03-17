from pprint import pprint
from rest_framework import serializers
import tweepy
from users.models import UserModel


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
        """TODO:add Async"""
        auth = tweepy.Client(
            "AAAAAAAAAAAAAAAAAAAAAP%2FwkgEAAAAApkYn6ZyoXj36VA0Tld5u8YBKsMU%3DWHMqSD6fDrChqzbM266HicH1IuVSsfRWVQbRWuwOUfoZY01vFw"
        )
        user = auth.get_user(username='ElonMusk')
        session = auth.get_users_tweets(user.data.id)
        tweets = session.data
        for tweet in tweets:
            print(tweet.id, tweet.text)
        return validated_data


class AuthenticationSerializer(serializers.ModelSerializer):
    """
    get: discord token
    return: JWT token
    description: Create Discord user or authorize
    """
    token = serializers.CharField()

    class Meta:
        model = UserModel
        fields = ('token', )
