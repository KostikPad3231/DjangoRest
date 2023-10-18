from django.contrib import admin
from django.urls import path, include
from rest_framework import routers

from accounts import views as accounts_views
from .views import BoardViewSet, TopicListAPIView, TopicDestroyAPIView, TopicCreateAPIView, TopicPostsListAPIView, \
    PostEditAPIView, TopicLastPostsListAPIView

router = routers.DefaultRouter()
router.register(r'boards', BoardViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('boards/<int:pk>/topics/', TopicListAPIView.as_view(), name='board_topics'),
    path('topics/<int:pk>/posts/', TopicPostsListAPIView.as_view(), name='topic_posts'),
    path('topics/<int:pk>/last-posts/', TopicLastPostsListAPIView.as_view(), name='topic_last_posts'),
    path('topics/<int:pk>/', TopicDestroyAPIView.as_view(), name='topic_delete'),
    path('topics/create/', TopicCreateAPIView.as_view(), name='topic_create'),
    path('posts/<int:pk>/', PostEditAPIView.as_view(), name='post_update'),
]
