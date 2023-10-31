"""
Django settings for server project.

Generated by 'django-admin startproject' using Django 4.2.5.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.2/ref/settings/
"""
import os
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-_z-avo*jopmp--hho8tnve=96-@(!y%g#(11obv^xc^mm!xbkz'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

# ALLOWED_HOSTS = ['*']
CSRF_TRUSTED_ORIGINS = ['http://localhost:3000']

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',
    'django.contrib.flatpages',

    'rest_framework',
    'rest_framework.authtoken',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.twitter',
    'allauth.socialaccount.providers.github',
    'allauth.socialaccount.providers.google',
    'dj_rest_auth',
    'dj_rest_auth.registration',

    # 'social_django',

    'corsheaders',

    'accounts',
    'core',
]

SITE_ID = 1

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',

    'allauth.account.middleware.AccountMiddleware',
    # 'social_django.middleware.SocialAuthExceptionMiddleware',
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        # 'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.TokenAuthentication',
    ]
}

REST_AUTH = {
    'OLD_PASSWORD_FIELD_ENABLED': True,
}

CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_METHODS = (
    "DELETE",
    "HEAD",
    "GET",
    "OPTIONS",
    "PATCH",
    "POST",
    "PUT",
)

ROOT_URLCONF = 'server.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / '../templates']
        ,
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',

                # 'social_django.context_processors.backends',
                # 'social_django.context_processors.login_redirect',
            ],
        },
    },
]

WSGI_APPLICATION = 'server.wsgi.application'

# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': os.environ.get('DATABASE_NAME', 'djangorest'),
        'USER': os.environ.get('DATABASE_USER', 'djangorest'),
        'PASSWORD': os.environ.get('DATABASE_PASSWORD', 'djangorest'),
        'HOST': os.environ.get('DATABASE_HOST', '0.0.0.0'),
        'PORT': os.environ.get('DATABASE_PORT', 5432),
    }
}

# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

AUTH_USER_MODEL = 'accounts.User'

# Allauth
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_EMAIL_VERIFICATION = 'mandatory'
ACCOUNT_AUTHENTICATION_METHOD = 'username'

# Media
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
MEDIA_URL = '/media/'

EMAIL_CONFIRM_REDIRECT_URL = 'http://localhost:3000/confirm-email/'
PASSWORD_RESET_REDIRECT_URL = 'http://localhost:3000/profile/password/reset/'

# PASSWORD_RESET_CONFIRM_REDIRECT_BASE_URL = \
#     "http://localhost:3000/password-reset/confirm/"

AUTHENTICATION_BACKENDS = (
    # 'social_core.backends.twitter.TwitterOAuth',
    'django.contrib.auth.backends.ModelBackend',
    'allauth.account.auth_backends.AuthenticationBackend',
)

LOGIN_URL = 'http://localhost:3000/login'
LOGOUT_URL = 'http://localhost:3000/logout'
CLIENT_URL = 'http://localhost:3000/boards'
LOGIN_REDIRECT_URL = 'http://localhost:3000/boards'

# SOCIAL_AUTH_GITHUB_KEY = 'bc34cbad1357908d48d3'
# SOCIAL_AUTH_GITHUB_SECRET = 'a86bc35ff51ba42c21aa66feb058701aefbca064'
#
# SOCIAL_AUTH_TWITTER_KEY = 'OhFd88hHMMqbI8MYAxYp6nbxW'
# SOCIAL_AUTH_TWITTER_SECRET = 'nsEiNCAaB5VDtc2vFiUmGPuyDSsrm6P0t291e1ix21xv5iHmTL'
#
# SOCIAL_AUTH_GITLAB_KEY = '3abed162d2ae869cbb2018155e1d684aaf2f47008b5a3b2ec1275647e7e351e7'
# SOCIAL_AUTH_GITLAB_SECRET = '980fab3a93be161981c9ff061e089e59598407a9bf08b0a76b8ab9eefa6eb8ad'

# twitter
# Z0NwU21FYnc4X3pTN0Vhb2FVMGo6MTpjaQ
# W_pGxBxNuuqAvrjUq69tmRFWUw9lkcK_xSs2-iBqG72ojO6l-s

# github
# bc34cbad1357908d48d3
# a86bc35ff51ba42c21aa66feb058701aefbca064

# ACCOUNT_ADAPTER = 'accounts.adapters.AccountAdapter'
SOCIALACCOUNT_ADAPTER = 'accounts.adapters.SocialAccountAdapter'
