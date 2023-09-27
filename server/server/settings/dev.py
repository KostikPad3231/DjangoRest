from .base import *

DEBUG = True
ALLOWED_HOSTS = ['*']

SITE_URL = 'http://localhost:3000'

EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
