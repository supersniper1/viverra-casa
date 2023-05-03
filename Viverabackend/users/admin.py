from django.contrib import admin
from django.contrib.auth import get_user_model
from django.utils.safestring import mark_safe

from .models import BufferUserWidgetModel, BufferUserSocketModel

UserModel = get_user_model()


@admin.register(UserModel)
class UsersAdmin(admin.ModelAdmin):
    readonly_fields = ('avatar_show',)
    list_display = (
        'uuid',
        'discord_tag',
        'avatar_show',
        'last_login',
        'is_superuser'
    )

    def avatar_show(self, obj):
        if obj.avatar:
            return mark_safe(
                f'<img src="data:image/png;base64,'
                f'{obj.avatar}" style="height: 80px; width:80px;">'
            )
        return '--пусто--'

    avatar_show.short_description = 'аватар'


@admin.register(BufferUserWidgetModel)
class BufferUserWidgetAdmin(admin.ModelAdmin):
    list_display = (
        'uuid',
        'user_uuid',
        'widget_uuid',
    )


@admin.register(BufferUserSocketModel)
class BufferUserSocketAdmin(admin.ModelAdmin):
    list_display = (
        'uuid',
        'user_uuid',
    )
