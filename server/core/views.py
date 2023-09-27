from django.db.models import Subquery, OuterRef
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from rest_framework.response import Response
from rest_framework.views import APIView

from core.models import Board, Post
from core.serializers import BoardSerializer
from core.utils import StandardResultSetPagination


class BoardViewSet(viewsets.ModelViewSet):
    serializer_class = BoardSerializer
    queryset = Board.objects.all()
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultSetPagination

    def get_queryset(self):
        board_list = Board.objects.all()
        board_list_annotated = board_list.filter(is_active=True).annotate(
            latest_post_id=Subquery(
                Post.objects.filter(topic__board=OuterRef('id'))
                .order_by('-created_at')
                .values('pk')[:1]),
            latest_post_created_at=Subquery(
                Post.objects.filter(topic__board=OuterRef('id'))
                .order_by('-created_at')
                .values('created_at')[:1]
            ),
            latest_post_created_by=Subquery(
                Post.objects.filter(topic__board=OuterRef('id'))
                .order_by('-created_at')
                .values('created_by__username')[:1]
            )
        ).order_by('-created_at')

        serializer = BoardSerializer(board_list_annotated, many=True)
        return Response(serializer.data)
