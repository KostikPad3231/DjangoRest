# Generated by Django 4.2.5 on 2023-10-11 11:36

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='photo',
            name='title',
        ),
    ]