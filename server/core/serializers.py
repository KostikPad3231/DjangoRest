from django.utils import timezone
from rest_framework import serializers
from drf_extra_fields.fields import Base64ImageField

from accounts.models import User, Action, Category
from accounts.serializers import UserSerializer
from core.models import Board, Topic, Post, Photo


class CategoriesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']


class BoardSerializer(serializers.ModelSerializer):
    latest_post_id = serializers.IntegerField(read_only=True)
    latest_post_created_at = serializers.DateTimeField(read_only=True)
    latest_post_created_by = serializers.CharField(read_only=True)
    latest_post_subject = serializers.CharField(read_only=True)
    latest_post_topic_id = serializers.IntegerField(read_only=True)
    posts_count = serializers.IntegerField(read_only=True)
    topics_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Board
        fields = ['id', 'name', 'description', 'created_at', 'is_active', 'latest_post_id', 'latest_post_created_at',
                  'latest_post_created_by', 'latest_post_subject', 'latest_post_topic_id', 'posts_count', 'topics_count']


class TopicSerializer(serializers.ModelSerializer):
    page_range = serializers.SerializerMethodField(method_name='get_page_range')
    has_many_pages_ = serializers.SerializerMethodField(method_name='has_many_pages')
    page_count = serializers.SerializerMethodField(method_name='get_page_count')
    starter = serializers.StringRelatedField()
    replies = serializers.IntegerField(read_only=True)

    class Meta:
        model = Topic
        fields = ['id',
                  'subject',
                  'starter',
                  'views',
                  'replies',
                  'page_range',
                  'has_many_pages_',
                  'page_count',
                  'last_updated']

    def get_page_range(self, obj):
        return obj.get_page_range()

    def has_many_pages(self, obj):
        return obj.has_many_pages()

    def get_page_count(self, obj):
        return obj.get_page_count()


class PhotoSerializer(serializers.ModelSerializer):
    file = Base64ImageField()

    class Meta:
        model = Photo
        fields = ['id', 'file']


class PostEditSerializer(serializers.ModelSerializer):
    photos = PhotoSerializer(many=True)
    photos_to_delete = serializers.ListField(child=serializers.IntegerField(), allow_empty=True, write_only=True)

    class Meta:
        model = Post
        fields = ['message', 'photos', 'photos_to_delete']

    def update(self, instance, validated_data):
        photos_to_delete = validated_data['photos_to_delete']
        Photo.objects.filter(id__in=photos_to_delete).delete()
        for photo in validated_data['photos']:
            Photo.objects.create(post=instance, **photo)
        instance.message = validated_data['message']
        instance.updated_at = timezone.now()
        instance.save()
        return instance


class TopicCreateSerializer(serializers.ModelSerializer):
    board = serializers.PrimaryKeyRelatedField(queryset=Board.objects.all())
    starter = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=False,
                                                 default=serializers.CurrentUserDefault())
    photos = PhotoSerializer(many=True, write_only=True)
    message = serializers.CharField(write_only=True, max_length=4000)

    class Meta:
        model = Topic
        fields = ['subject', 'board', 'starter', 'message', 'photos']

    def create(self, validated_data):
        photos = validated_data.pop('photos')
        message = validated_data.pop('message')
        topic = Topic.objects.create(**validated_data)
        post = Post.objects.create(message=message, topic=topic, created_by=validated_data['starter'])
        for photo in photos:
            Photo.objects.create(post=post, **photo)
        return topic


class TopicPostsSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    photos = PhotoSerializer(many=True)
    topic_id = serializers.IntegerField(write_only=True)
    user = serializers.IntegerField(write_only=True, default=serializers.CurrentUserDefault(), required=False)
    message = serializers.CharField(max_length=4000)

    class Meta:
        model = Post
        fields = ['id', 'message', 'created_at', 'updated_at', 'created_by', 'photos', 'topic_id', 'user']

    def create(self, validated_data):
        topic_id = validated_data.pop('topic_id')
        topic = Topic.objects.get(pk=topic_id)
        photos = validated_data.pop('photos')
        user = validated_data.pop('user')
        post = Post.objects.create(topic=topic, created_by=user, **validated_data)
        for photo in photos:
            Photo.objects.create(post=post, **photo)
        return post
