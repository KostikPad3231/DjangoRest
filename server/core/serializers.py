from rest_framework import serializers

from core.models import Board


class BoardSerializer(serializers.ModelSerializer):
    latest_post_id = serializers.IntegerField()
    latest_post_created_at = serializers.DateTimeField()
    latest_post_created_by = serializers.CharField()

    class Meta:
        model = Board
        fields = ['id', 'name', 'description', 'created_at', 'is_active', 'latest_post_id', 'latest_post_created_at',
                  'latest_post_created_by']
