import json
from channels.generic.websocket import WebsocketConsumer


class TestConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()
        self.send(
            text_data=json.dumps(
                [
                    'test connection'
                ]
            )
        )

    def receive(self, text_data=None, bytes_data=None):

        try:
            self.send(
                text_data=json.dumps(
                    [
                        'test answer'
                    ]
                )
            )
        except Exception as ex:
            print(ex)

    async def disconnect(self, code):
        pass
