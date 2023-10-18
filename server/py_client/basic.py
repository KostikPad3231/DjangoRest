import urllib.parse

from django.conf import settings
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.shortcuts import redirect
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework import generics
from rest_framework.authtoken.models import Token
from rest_framework.response import Response

from dj_rest_auth.registration.views import RegisterView, SocialLoginView
from allauth.socialaccount.providers.twitter.views import TwitterOAuthAdapter
from allauth.socialaccount.providers.github.views import GitHubOAuth2Adapter
from dj_rest_auth.social_serializers import TwitterLoginSerializer
from allauth.socialaccount.providers.oauth2.client import OAuth2Client

from accounts.models import User
from accounts.serializers import UserSerializer, BloggerRegisterSerializer, ReaderRegisterSerializer


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


class BloggerRegistrationView(RegisterView):
    serializer_class = BloggerRegisterSerializer


class ReaderRegistrationView(RegisterView):
    serializer_class = ReaderRegisterSerializer


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
    # serializer_class = TwitterLoginSerializer
    adapter_class = TwitterOAuthAdapter
    client_class = OAuth2Client

    @property
    def callback_url(self):
        return self.request.build_absolute_uri(reverse('twitter_callback'))


class GitHubLogin(SocialLoginView):
    adapter_class = GitHubOAuth2Adapter
    client_class = OAuth2Client

    @property
    def callback_url(self):
        return self.request.build_absolute_uri(reverse('github_callback'))


def github_callback(request):
    params = urllib.parse.urlencode(request.GET)
    return redirect(f'http://localhost:3000/auth/github?{params}')


def twitter_callback(request):
    params = urllib.parse.urlencode(request.GET)
    return redirect(f'http://localhost:3000/auth/twitter?{params}')
