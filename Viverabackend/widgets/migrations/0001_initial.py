# Generated by Django 4.2 on 2023-05-21 17:46

import uuid

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('contenttypes', '0002_remove_content_type_name'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='DesktopModel',
            fields=[
                ('uuid', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, unique=True)),
                ('desktop_name', models.CharField(max_length=100)),
                ('user_uuid', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='buffer_user', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='FolderModel',
            fields=[
                ('uuid', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, unique=True)),
                ('user_uuid', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='folder_user', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='WidgetModel',
            fields=[
                ('uuid', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, unique=True)),
                ('widget_tag', models.CharField(max_length=100)),
                ('widget_x', models.IntegerField()),
                ('widget_y', models.IntegerField()),
                ('widget_size_x', models.IntegerField()),
                ('widget_size_y', models.IntegerField()),
                ('z_index', models.IntegerField()),
                ('is_collapsed', models.BooleanField()),
                ('desktop', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='desktop_widget', to='widgets.desktopmodel')),
                ('folder', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='folder_widget', to='widgets.foldermodel')),
                ('polymorphic_ctype', models.ForeignKey(editable=False, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='polymorphic_%(app_label)s.%(class)s_set+', to='contenttypes.contenttype')),
            ],
            options={
                'verbose_name': 'Widget',
                'verbose_name_plural': 'all_Widgets',
            },
        ),
        migrations.CreateModel(
            name='WidgetsDiscordModel',
            fields=[
                ('widgetmodel_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='widgets.widgetmodel')),
                ('tracked_server', models.CharField(max_length=100)),
            ],
            options={
                'verbose_name': 'Discord Widget',
                'verbose_name_plural': 'Discord Widgets',
            },
            bases=('widgets.widgetmodel',),
        ),
        migrations.CreateModel(
            name='WidgetsNoteModel',
            fields=[
                ('widgetmodel_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='widgets.widgetmodel')),
                ('text', models.TextField()),
            ],
            options={
                'verbose_name': 'Note Widget',
                'verbose_name_plural': 'Note Widgets',
            },
            bases=('widgets.widgetmodel',),
        ),
        migrations.CreateModel(
            name='WidgetsTwitterModel',
            fields=[
                ('widgetmodel_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='widgets.widgetmodel')),
                ('tracked_name', models.CharField(max_length=100)),
            ],
            options={
                'verbose_name': 'Twitter Widget',
                'verbose_name_plural': 'Twitter Widgets',
            },
            bases=('widgets.widgetmodel',),
        ),
    ]
