from django.urls import path, include, re_path
from rest_framework.authtoken import views
from dj_rest_auth.views import PasswordResetConfirmView
from accounts.views import BloggerRegistrationView, ReaderRegistrationView

urlpatterns = [
    path('', include('dj_rest_auth.urls')),
    path('registration/blogger', BloggerRegistrationView.as_view(), name='register_blogger'),
    path('registration/reader', ReaderRegistrationView.as_view(), name='register_reader'),
    path('registration/', include('dj_rest_auth.registration.urls')),
    re_path(
        r'^rest-auth/password/reset/confirm/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/$',
        PasswordResetConfirmView.as_view(),
        name='password_reset_confirm'),
    re_path(r'^api-token-auth/', views.obtain_auth_token),
]
