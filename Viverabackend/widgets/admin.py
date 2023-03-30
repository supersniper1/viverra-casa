from django.contrib import admin


from .models import WidgetsDiscordModel, WidgetsTwitterModel, WidgetModel


@admin.register(WidgetModel)
class WidgetAdmin(admin.ModelAdmin):
    list_display = (
        'uuid',
        'widget_tag',
    )


@admin.register(WidgetsDiscordModel)
class WidgetDiscordAdmin(admin.ModelAdmin):
    list_display = (
        'uuid',
        'widget_tag',
    )


@admin.register(WidgetsTwitterModel)
class WidgetsTwitterAdmin(admin.ModelAdmin):
    list_display = (
        'uuid',
        'widget_tag',
    )
