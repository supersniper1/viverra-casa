from .widget_consumers import WidgetNamespace, sio
from .folder_consumers import FolderNamespace

sio.register_namespace(WidgetNamespace('/widget'))
sio.register_namespace(FolderNamespace('/folder'))