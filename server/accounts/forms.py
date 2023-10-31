from PIL import Image
from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.db import transaction

from .models import User, Category, Blogger, Reader, Avatar


class BloggerSignUpForm(UserCreationForm):
    email = forms.CharField(max_length=254, required=True, widget=forms.EmailInput())
    categories = forms.ModelMultipleChoiceField(
        queryset=Category.objects.all(),
        widget=forms.CheckboxSelectMultiple,
        required=False
    )
    birthday = forms.DateField(widget=forms.DateInput(attrs={'type': 'date'}))
    country_city = forms.CharField(max_length=255)

    class Meta:
        model = User
        fields = ['email', 'username', 'password1', 'password2', 'birthday', 'country_city', 'categories']

    @transaction.atomic
    def save(self):
        user = super().save(commit=False)
        user.is_blogger = True
        user.save()

        blogger = Blogger(
            user=user
        )
        blogger.birthday = self.cleaned_data.get('birthday')
        blogger.country_city = self.cleaned_data.get('country_city')
        blogger.save()
        blogger.categories.set(self.cleaned_data.get('categories'))
        blogger.save()
        return user


class ReaderSignUpForm(UserCreationForm):
    email = forms.CharField(max_length=254, required=True, widget=forms.EmailInput())
    interests = forms.ModelMultipleChoiceField(
        queryset=Category.objects.all(),
        widget=forms.CheckboxSelectMultiple,
        required=False
    )
    has_eighteen = forms.BooleanField()

    class Meta:
        model = User
        fields = ['email', 'username', 'password1', 'password2', 'has_eighteen', 'interests']

    @transaction.atomic
    def save(self):
        user = super().save(commit=False)
        user.is_reader = True
        user.save()

        reader = Reader(
            user=user
        )
        reader.has_eighteen = self.cleaned_data.get('has_eighteen')
        reader.save()
        reader.interests.set(self.cleaned_data.get('interests'))
        reader.save()
        return user


class AvatarForm(forms.ModelForm):
    x = forms.FloatField(widget=forms.HiddenInput())
    y = forms.FloatField(widget=forms.HiddenInput())
    width = forms.FloatField(widget=forms.HiddenInput())
    height = forms.FloatField(widget=forms.HiddenInput())

    class Meta:
        model = Avatar
        fields = ('file', 'x', 'y', 'width', 'height')

    def save(self, commit=True):
        avatar = super(AvatarForm, self).save(commit)

        x = self.cleaned_data.get('x')
        y = self.cleaned_data.get('y')
        w = self.cleaned_data.get('width')
        h = self.cleaned_data.get('height')

        image = Image.open(avatar.file)
        cropped_image = image.crop((x, y, w + x, h + y))
        resized_image = cropped_image.resize((64, 64), Image.LANCZOS)
        resized_image.save(avatar.file.path)

        return avatar
