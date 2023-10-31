import urllib.parse

import requests
from dj_rest_auth.views import PasswordChangeView
from django.conf import settings
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.shortcuts import redirect
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework import generics, status
from rest_framework.authtoken.models import Token
from rest_framework.response import Response

from dj_rest_auth.views import LoginView
from dj_rest_auth.registration.views import RegisterView, SocialLoginView
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.twitter.views import TwitterOAuthAdapter
from allauth.socialaccount.providers.github.views import GitHubOAuth2Adapter
from dj_rest_auth.social_serializers import TwitterLoginSerializer
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialAccountListView

from accounts.models import User
from accounts.serializers import UserSerializer, BloggerRegisterSerializer, ReaderRegisterSerializer, \
    SocialAccountListSerializer, PasswordSetSerializer


def check_captcha(request):
    captcha = request.data['captcha']
    url = 'https://www.google.com/recaptcha/api/siteverify'
    data = {
        'secret': settings.RECAPTCHA_SECRET_KEY,
        'response': captcha
    }
    response = requests.post(url, data=data)
    return response.json()


class CaptchaLoginAPIView(LoginView):
    def get_response(self):
        captcha_result = check_captcha(self.request)
        if captcha_result['success']:
            return super().get_response()
        else:
            return Response({'captcha': 'invalid captcha'}, status=status.HTTP_403_FORBIDDEN)


class UserRetrieveAPIView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        self.kwargs['pk'] = self.request.user.pk
        return super(UserRetrieveAPIView, self).get_object()


class VerifyToken(APIView):
    def get(self, request):
        token_header = request.headers['Authorization'].split(' ')
        if len(token_header) == 2:
            token = token_header[1]
        else:
            token = None
        if token and Token.objects.filter(key=token).exists():
            return Response({'verified': True})
        return Response({'verified': False})


class RegistrationView(RegisterView):
    def create(self, request, *args, **kwargs):
        captcha_result = check_captcha(self.request)
        if captcha_result['success']:
            return super().create(request, args, kwargs)
        else:
            return Response({'captcha': 'invalid captcha'}, status=status.HTTP_403_FORBIDDEN)


class BloggerRegistrationView(RegistrationView):
    serializer_class = BloggerRegisterSerializer


class ReaderRegistrationView(RegistrationView):
    serializer_class = ReaderRegisterSerializer


class SetPasswordView(PasswordChangeView):
    serializer_class = PasswordSetSerializer


@api_view(['GET'])
def email_confirm_redirect(request, key):
    return HttpResponseRedirect(f'{settings.EMAIL_CONFIRM_REDIRECT_URL}{key}/')


@api_view(['GET'])
def password_reset_redirect(request, uid, token):
    return HttpResponseRedirect(f'{settings.PASSWORD_RESET_REDIRECT_URL}{uid}/{token}/')


class UserUpdateAPIView(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        self.kwargs['pk'] = self.request.user.pk
        return super(UserUpdateAPIView, self).get_object()


class TwitterLogin(SocialLoginView):
    serializer_class = TwitterLoginSerializer
    adapter_class = TwitterOAuthAdapter

    # client_class = OAuth2Client

    @property
    def callback_url(self):
        return self.request.build_absolute_uri(reverse('twitter_callback'))


class GitHubLogin(SocialLoginView):
    adapter_class = GitHubOAuth2Adapter
    client_class = OAuth2Client

    @property
    def callback_url(self):
        return self.request.build_absolute_uri(reverse('github_callback'))


class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    client_class = OAuth2Client

    @property
    def callback_url(self):
        return self.request.build_absolute_uri(reverse('google_callback'))


def github_callback(request):
    code = request.GET['code']
    state = request.GET['state']

    response = requests.post(request.build_absolute_uri(reverse('github_login')), data={
        'code': code,
        'state': state,
    })

    key = response.json()['key']

    return redirect(f'http://localhost:3000/auth/github?key={key}')


def google_callback(request):
    code = request.GET['code']
    state = request.GET['state']

    response = requests.post(request.build_absolute_uri(reverse('google_login')), data={
        'code': code,
        'state': state,
    })

    key = response.json()['key']

    return redirect(f'http://localhost:3000/auth/google?key={key}')


def twitter_callback(request):
    oauth_token = request.GET['oauth_token']
    oauth_verifier = request.GET['oauth_verifier']

    response = requests.post(request.build_absolute_uri(reverse('twitter_login')), data={
        'access_token': oauth_token,
        'token_secret': oauth_verifier,
    })
    key = response.json()['key']

    return redirect(f'http://localhost:3000/auth/github?key={key}')


@api_view(['GET'])
def twitter_login_url(request):
    response = requests.head(request.build_absolute_uri(reverse('twitter_login_url')))
    return Response({'url': response.headers['Location']})


@api_view(['GET'])
def github_login_url(request):
    response = requests.head(request.build_absolute_uri(reverse('github_login_url')))
    return Response({'url': response.headers['Location']})


@api_view(['GET'])
def google_login_url(request):
    response = requests.head(request.build_absolute_uri(reverse('google_login_url')))
    return Response({'url': response.headers['Location']})


class SocialAccountListAPIView(SocialAccountListView):
    serializer_class = SocialAccountListSerializer
