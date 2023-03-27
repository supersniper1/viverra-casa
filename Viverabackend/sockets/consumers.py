import socketio

sio = socketio.AsyncServer(async_mode='asgi', cors_allowed_origins='*')
app = socketio.ASGIApp(sio)


class MyCustomNamespace(socketio.AsyncNamespace):
    async def on_connect(self, sid, environ):
        await self.send(data="I'm connected!", to=sid)

    async def on_disconnect(self, sid):
        pass

    async def on_post(self, sid, data):
        await self.send(data='hellow from custom event post', to=sid)

    async def on_message(self, sid,  data):
        print('message received with ', data)
        await self.send(data=('my response', {'response': 'my response'}), to=sid)


sio.register_namespace(MyCustomNamespace('/test'))
