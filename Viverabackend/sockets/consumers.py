import socketio


class WebSocketIoNamespace(socketio.AsyncNamespace):
    async def on_connect(self, sid, environ):
        await self.send(data="connected", to=sid)

    async def on_disconnect(self, sid):
        await self.send(data="disconnected", to=sid)

    async def on_post(self, sid, data):
        await self.send(data='hello from custom event post', to=sid)

    async def on_message(self, sid,  data):
        await self.send(data=('my response', {'response': 'my response'}), to=sid)
