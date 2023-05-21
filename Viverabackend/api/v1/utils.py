from widgets.models import DesktopModel


def is_desktop_can_exist(user_uuid):
    desktop_count = DesktopModel.objects.filter(user_uuid=user_uuid).count()
    return desktop_count < 4
