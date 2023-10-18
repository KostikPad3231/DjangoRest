import math

from django.conf import settings
from django.db import models
from django.utils import html
from django.utils.text import Truncator
from django.utils.html import mark_safe
from markdown import markdown

from accounts.models import User


class Board(models.Model):
    name = models.CharField(max_length=30, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    description = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)


class Topic(models.Model):
    subject = models.CharField(max_length=255)
    last_updated = models.DateTimeField(auto_now_add=True)
    board = models.ForeignKey(Board, related_name='topics', on_delete=models.CASCADE)
    starter = models.ForeignKey(User, related_name='topics', on_delete=models.CASCADE)
    views = models.PositiveIntegerField(default=0)

    def get_page_count(self):
        count = self.posts.count()
        pages = count / 10
        return math.ceil(pages)

    def has_many_pages(self, count=None):
        if count is None:
            count = self.get_page_count()
        return count > 6

    def get_page_range(self):
        count = self.get_page_count()
        if self.has_many_pages(count):
            return list(range(1, 4)) + [count]
        return list(range(1, count + 1))

    def get_last_ten_posts(self):
        return self.posts.order_by('-created_at')[:10]

    def __str__(self):
        return self.subject


class Post(models.Model):
    message = models.TextField(max_length=4000)
    topic = models.ForeignKey(Topic, related_name='posts', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(null=True)
    created_by = models.ForeignKey(User, related_name='posts', on_delete=models.CASCADE)
    updated_by = models.ForeignKey(User, null=True, related_name='+', on_delete=models.CASCADE)

    def get_message_as_markdown(self):
        return mark_safe(markdown(html.escape(self.message)))

    def __str__(self):
        truncated_message = Truncator(self.message)
        return truncated_message.chars(30)


class Photo(models.Model):
    file = models.ImageField(upload_to='posts/images')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    post = models.ForeignKey(Post, related_name='photos', on_delete=models.CASCADE, null=True, blank=True)
