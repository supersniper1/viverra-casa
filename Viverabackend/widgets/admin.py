from django.contrib import admin

from .models import (DesktopModel, WidgetsDiscordModel, WidgetsNoteModel,
                     WidgetsTwitterModel)


@admin.register(DesktopModel)
class DesktopModelAdmin(admin.ModelAdmin):
    list_display = (
        'uuid',
        'user_uuid',
    )


@admin.register(WidgetsDiscordModel)
class WidgetDiscordAdmin(admin.ModelAdmin):
    list_display = (
        'uuid',
        'widget_tag',
    )


@admin.register(WidgetsTwitterModel)
class WidgetTwitterAdmin(admin.ModelAdmin):
    list_display = (
        'uuid',
        'widget_tag',
    )


@admin.register(WidgetsNoteModel)
class WidgetNoteAdmin(admin.ModelAdmin):
    list_display = (
        'uuid',
        'widget_tag',
    )
