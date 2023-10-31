from .base import *

DEBUG = True
ALLOWED_HOSTS = ['localhost']

SITE_URL = 'http://localhost:3000'

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.mailgun.org'
EMAIL_PORT = 587
EMAIL_HOST_USER = 'postmaster@sandbox44a78a0ae6084c1d8e2874eb5f275c2b.mailgun.org'
EMAIL_HOST_PASSWORD = '422bbd011244ff2ee9be23a32180c3f2-f0e50a42-2dd769ff'
EMAIL_USE_TLS = True

# was redis instead of localhost
CELERY_BROKER_URL = 'redis://redis:6379/0'

RECAPTCHA_SITE_KEY = '6LcFwbYnAAAAAOWfXqUrBN-uvDdPgGbJmEwVjocz'
RECAPTCHA_SECRET_KEY = '6LcFwbYnAAAAAIar7VZDS0wE5JxqUFLITE961q0E'
