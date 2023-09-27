from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework import viewsets
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from dj_rest_auth.registration.views import RegisterView

from accounts.models import User
from accounts.serializers import UserSerializer, BloggerRegisterSerializer, ReaderRegisterSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        if self.kwargs.get('pk', None) == 'me':
            self.kwargs['pk'] = self.request.user.pk
        return super(UserViewSet, self).get_object()


class VerifyToken(APIView):
    def get(self, request):
        print('VerifyToken view', flush=True)
        print(request, flush=True)
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
