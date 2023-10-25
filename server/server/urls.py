"""
URL configuration for server project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include

from dj_rest_auth.registration.views import SocialAccountDisconnectView
from allauth.socialaccount.providers.google import views as google_views
from allauth.socialaccount.providers.github import views as github_views
from allauth.socialaccount.providers.twitter import views as twitter_views

from accounts import views as accounts_views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', include('accounts.urls')),
    # path('oauth/', include('social_django.urls', namespace='social')),
    path('oauth/accounts/', accounts_views.SocialAccountListAPIView.as_view(), name='social_account_list'),
    path('oauth/accounts/<int:pk>/disconnect/', SocialAccountDisconnectView.as_view(), name='social_account_disconnect'),

    path('oauth/twitter/', accounts_views.TwitterLogin.as_view(), name='twitter_login'),
    path('oauth/github/', accounts_views.GitHubLogin.as_view(), name='github_login'),
    path('oauth/google/', accounts_views.GoogleLogin.as_view(), name='google_login'),

    path('oauth/twitter/callback/', accounts_views.twitter_callback, name='twitter_callback'),
    path('oauth/github/callback/', accounts_views.github_callback, name='github_callback'),
    path('oauth/google/callback/', accounts_views.google_callback, name='google_callback'),

    path('oauth/twitter/url/', twitter_views.oauth_login, name='twitter_login_url'),
    path('oauth/twitter/loginurl/', accounts_views.twitter_login_url, name='get_twitter_login_url'),

    path('oauth/github/url/', github_views.oauth2_login, name='github_login_url'),
    path('oauth/github/loginurl/', accounts_views.github_login_url, name='get_github_login_url'),

    path('oauth/google/url/', google_views.oauth2_login, name='google_login_url'),
    path('oauth/google/loginurl/', accounts_views.google_login_url, name='get_google_login_url'),

    path('api/user/me/', accounts_views.UserRetrieveAPIView.as_view()),
    path('api/user/me/edit/', accounts_views.UserUpdateAPIView.as_view()),
    path('api/token/verify-token/', accounts_views.VerifyToken.as_view()),
    path('api/', include('core.urls')),

    path('pages/', include('django.contrib.flatpages.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)
