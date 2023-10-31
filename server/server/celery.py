from __future__ import absolute_import

import os
import warnings

from django.conf import settings

from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'server.settings.dev')

app = Celery('server')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()

# def get_celery_worker_status():
#     i = app.control.inspect()
#     availability = i.ping()
#     stats = i.stats()
#     registered_tasks = i.registered()
#     active_tasks = i.active()
#     scheduled_tasks = i.scheduled()
#     result = {
#         'availability': availability,
#         'stats': stats,
#         'registered_tasks': registered_tasks,
#         'active_tasks': active_tasks,
#         'scheduled_tasks': scheduled_tasks
#     }
#     return result
#
#
# print(get_celery_worker_status())


@app.task(bind=True)
def debug_task(self):
    print('Request: {0!r}'.format(self.request))
