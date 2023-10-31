from django.contrib import admin
from django.urls import path, include
from rest_framework import routers

from accounts import views as accounts_views
from .views import BoardViewSet, TopicListAPIView, TopicDestroyAPIView, TopicCreateAPIView, TopicPostsListAPIView, \
    PostEditAPIView, TopicLastPostsListAPIView, ExportTopicsToCSV, ExportTopicsToPDF, CategoriesListAPIView

router = routers.DefaultRouter()
router.register(r'boards', BoardViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('categories/', CategoriesListAPIView.as_view(), name='categories-list'),
    path('boards/<int:pk>/topics/', TopicListAPIView.as_view(), name='board_topics'),
    path('boards/<int:pk>/topics/export/csv/', ExportTopicsToCSV.as_view(), name='export_topics_csv'),
    path('boards/<int:pk>/topics/export/pdf/', ExportTopicsToPDF.as_view(), name='export_topics_pdf'),
    path('topics/<int:pk>/posts/', TopicPostsListAPIView.as_view(), name='topic_posts'),
    path('topics/<int:pk>/last-posts/', TopicLastPostsListAPIView.as_view(), name='topic_last_posts'),
    path('topics/<int:pk>/', TopicDestroyAPIView.as_view(), name='topic_delete'),
    path('topics/create/', TopicCreateAPIView.as_view(), name='topic_create'),
    path('posts/<int:pk>/', PostEditAPIView.as_view(), name='post_update'),
]
