from pprint import pprint
from rest_framework import serializers
import tweepy


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
        auth = tweepy.Client(
            "AAAAAAAAAAAAAAAAAAAAAP%2FwkgEAAAAApkYn6ZyoXj36VA0Tld5u8YBKsMU%3DWHMqSD6fDrChqzbM266HicH1IuVSsfRWVQbRWuwOUfoZY01vFw")
        user = auth.get_user(username='ElonMusk')
        session = auth.get_users_tweets(user.data.id)
        tweets = session.data
        for tweet in tweets:
            print(tweet.id, tweet.text)
        return validated_data
