from pprint import pprint

import socketio


class WidgetNamespace(socketio.AsyncNamespace):
    """Widget Namespace"""
    async def on_connect(self, sid, environ):
        pprint(environ)
        await self.send(data="connected", to=sid)

    async def on_disconnect(self, sid):
        pass

    async def on_get_all_widgets(self, sid, data):
        """get all widgets from current User"""
        data = [
            {
                "widget_tag": "test_tag",
                "widget_x": 999,
                "widget_y": 888,
                "widget_size_x": 999,
                "widget_size_y": 888,
                "some_custom_field": "test_fill"
            },
            {
                "widget_tag": "test_tag",
                "widget_x": 999,
                "widget_y": 888,
                "widget_size_x": 999,
                "widget_size_y": 888,
                "some_custom_field": "test_fill"
            },
        ]

        await self.send(data=data, to=sid)

    async def on_post_widget(self, sid, data):
        """Create One Widget for current User"""

        await self.send(data=("dasdasd", "sdasd"), to=sid)

    async def on_update_widget(self, sid, data):
        """Update One Widget for current User"""

    async def on_delete_widget(self, sid, data):
        """Delete One Widget for current User"""
