from dj_rest_auth.registration.views import VerifyEmailView
from django.urls import path, include, re_path
from dj_rest_auth.views import PasswordResetConfirmView
from .views import BloggerRegistrationView, ReaderRegistrationView, email_confirm_redirect, password_reset_redirect

urlpatterns = [
    path('', include('dj_rest_auth.urls')),
    path('accounts/', include('allauth.urls')),
    path('registration/blogger/', BloggerRegistrationView.as_view(), name='register_blogger'),
    path('registration/reader/', ReaderRegistrationView.as_view(), name='register_reader'),
    path(
        'registration/confirm-email/', VerifyEmailView.as_view(),
        name='account_confirm_email',
    ),
    re_path(
        r'^registration/account-confirm-email/(?P<key>[-:\w]+)/$', email_confirm_redirect,
        name='redirect_account_confirm_email',
    ),
    path('registration/', include('dj_rest_auth.registration.urls')),
    path(
        'rest-auth/password/reset/confirm/<uid>/<token>/',
        password_reset_redirect,
        name='password_reset_confirm'),
    path(
        'rest-auth/password/reset/confirm/',
        PasswordResetConfirmView.as_view(),
        name='password_reset_confirm_complete'),
]
