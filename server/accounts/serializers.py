from django.utils.translation import gettext_lazy as _
from rest_framework import serializers

from drf_extra_fields.fields import Base64ImageField

from allauth.account import app_settings as allauth_settings
from allauth.account.adapter import get_adapter
from allauth.account.utils import setup_user_email

from .models import User, Blogger, Reader, Category


class UserSerializer(serializers.ModelSerializer):
    avatar = Base64ImageField(
        required=False)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'avatar', 'auth_token')


class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField(required=allauth_settings.EMAIL_REQUIRED)
    username = serializers.CharField(required=True, write_only=True)
    password1 = serializers.CharField(required=True, write_only=True)
    password2 = serializers.CharField(required=True, write_only=True)

    def validate_email(self, email):
        email = get_adapter().clean_email(email)
        if allauth_settings.UNIQUE_EMAIL:
            if email:
                raise serializers.ValidationError(
                    _('A user is already registered with this e-mail address.')
                )
        return email

    def validate_password1(self, password):
        return get_adapter().clean_password(password)

    def validate(self, data):
        if data['password1'] != data['password2']:
            raise serializers.ValidationError(
                _('The two password fields didn\'t match.')
            )
        return data

    def get_cleaned_data(self):
        return {
            'username': self.validated_data.get('username', ''),
            'password1': self.validated_data.get('password1', ''),
            'email': self.validated_data.get('email', ''),
        }

    def save(self, request):
        adapter = get_adapter()
        user = adapter.new_user(request)
        self.cleaned_data = self.get_cleaned_data()
        adapter.save_user(request, user, self)
        setup_user_email(request, user, [])
        user.save()
        return user


class BloggerRegisterSerializer(RegisterSerializer):
    birthday = serializers.DateField()
    country_city = serializers.CharField(max_length=255)
    categories = serializers.StringRelatedField(many=True, read_only=True)

    def get_cleaned_data(self):
        data = super(BloggerRegisterSerializer, self).get_cleaned_data()
        extra_data = {
            'birthday': self.validated_data.get('birthday', ''),
            'country_city': self.validated_data.get('country_city', ''),
            'categories': self.validated_data.get('categories', ''),
        }
        data.update(extra_data)
        return data

    def save(self, request):
        user = super(BloggerRegisterSerializer, self).save(request)
        user.is_blogger = True
        user.save()
        blogger = Blogger(user=user, birthday=self.cleaned_data.get('birthday'),
                          country_city=self.cleaned_data.get('country_city'),
                          categories=self.cleaned_data.get('categories'))
        blogger.save()
        return blogger


class ReaderRegisterSerializer(RegisterSerializer):
    has_eighteen = serializers.BooleanField()
    interests = serializers.StringRelatedField(many=True, read_only=True)

    def get_cleaned_data(self):
        data = super(ReaderRegisterSerializer, self).get_cleaned_data()
        extra_data = {
            'has_eighteen': self.validated_data.get('has_eighteen', ''),
            'interests': self.validated_data.get('interests', ''),
        }
        data.update(extra_data)
        return data

    def save(self, request):
        user = super(ReaderRegisterSerializer, self).save(request)
        user.is_reader = True
        user.save()
        reader = Reader(user=user,
                        has_eighteen=self.cleaned_data.get('has_eighteen'),
                        interests=self.cleaned_data.get('interests'))
        reader.save()
        return reader
