from django.contrib import admin


from .models import WidgetsDiscordModel, WidgetsTwitterModel, WidgetModel, WidgetsNoteModel


# @admin.register(WidgetModel)
# class WidgetAdmin(admin.ModelAdmin):
#     list_display = (
#         'uuid',
#         'widget_tag',
#     )


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
