from django.conf import settings
from django.db import models
from django.contrib.auth.models import AbstractUser


class Category(models.Model):
    name = models.CharField(max_length=25, unique=True)

    def __str__(self):
        return self.name


class User(AbstractUser):
    is_blogger = models.BooleanField(default=False)
    is_reader = models.BooleanField(default=False)

    def posts_count(self):
        return self.posts.count()

    def last_actions(self):
        return Action.objects.filter(user_id=self.id).order_by('-made_at')[:10]


class Blogger(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, primary_key=True)
    birthday = models.DateField()
    country_city = models.CharField(max_length=255)
    categories = models.ManyToManyField(Category, related_name='bloggers')


class Reader(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    interests = models.ManyToManyField(Category, related_name='readers')
    has_eighteen = models.BooleanField()


class Action(models.Model):
    class ActionTag(models.TextChoices):
        CREATE = 'C'
        UPDATE = 'U'
        DELETE = 'D'

    message = models.CharField()
    action_tag = models.CharField(max_length=1, choices=ActionTag.choices)
    subject_name = models.CharField(max_length=100, null=True)
    subject = models.ForeignKey('core.Board', on_delete=models.SET_NULL, null=True)
    user = models.ForeignKey(User, related_name='actions', on_delete=models.CASCADE)
    made_at = models.DateTimeField(auto_now_add=True)


class Avatar(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True)
    file = models.ImageField(upload_to='profile/avatars')
    uploaded_at = models.DateTimeField(null=True)
