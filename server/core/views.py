import csv

from django.db.models import Subquery, OuterRef, Count, F, Q, Sum
from django.template.loader import render_to_string
from django.http import HttpResponse
from django.views import View
from rest_framework import viewsets, generics, status, mixins
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticated

from rest_framework.response import Response
from rest_framework.views import APIView
from weasyprint import HTML

from accounts.models import Action
from .models import Board, Post, Topic
from .serializers import BoardSerializer, TopicSerializer, TopicCreateSerializer, TopicPostsSerializer, \
    PostEditSerializer
from core.utils import StandardResultSetPagination


class BoardViewSet(viewsets.ModelViewSet):
    serializer_class = BoardSerializer
    queryset = Board.objects.all()
    # TODO return permissions
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultSetPagination

    def get_queryset(self):
        board_list = Board.objects.all()
        filtering = Q(topic__board=OuterRef('id'))
        board_list_annotated = board_list.filter(is_active=True).annotate(
            latest_post_id=Subquery(
                Post.objects.filter(filtering)
                .order_by('-created_at')
                .values('pk')[:1]
            ),
            latest_post_created_at=Subquery(
                Post.objects.filter(filtering)
                .order_by('-created_at')
                .values('created_at')[:1]
            ),
            latest_post_created_by=Subquery(
                Post.objects.filter(filtering)
                .order_by('-created_at')
                .values('created_by__username')[:1]
            ),
        ).order_by('-created_at')
        board_list_annotated = board_list_annotated.annotate(
            topics_count=Count('topics', distinct=True),
            posts_count=Count('topics__posts')
        )
        return board_list_annotated

    # TODO ADD board pk to action serializer
    def destroy(self, request, *args, **kwargs):
        board_name = get_object_or_404(Board, pk=self.kwargs['pk']).name
        result = super().destroy(request, args, kwargs)
        Action.objects.create(action_tag=Action.ActionTag.DELETE, message='has been deleted successfully',
                              subject_name=board_name, user=request.user)
        return result

    def update(self, request, *args, **kwargs):
        board = get_object_or_404(Board, pk=self.kwargs['pk'])
        result = super().update(request, args, kwargs)
        Action.objects.create(action_tag=Action.ActionTag.UPDATE, message='has been updated successfully',
                              subject_name=board.name, subject=board, user=request.user)
        return result

    def create(self, request, *args, **kwargs):
        result = super().create(request, args, kwargs)
        board = Board.objects.get(name=request.data['name'])
        Action.objects.create(action_tag=Action.ActionTag.CREATE, message='has been created successfully',
                              subject_name=board.name, subject=board, user=request.user)
        return result


class TopicListAPIView(generics.ListAPIView):
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultSetPagination

    def get_queryset(self):
        return Topic.objects.filter(board_id=self.kwargs['pk']).order_by('-last_updated').annotate(
            replies=Count('posts') - 1)


class TopicDestroyAPIView(generics.DestroyAPIView):
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer
    permission_classes = [IsAuthenticated]


class TopicCreateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = TopicCreateSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class TopicPostsListAPIView(mixins.CreateModelMixin, generics.ListAPIView):
    queryset = Post.objects.all()
    serializer_class = TopicPostsSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultSetPagination

    def get_queryset(self):
        topic = get_object_or_404(Topic, pk=self.kwargs['pk'])
        topic.views += 1
        topic.save()
        return Post.objects.filter(topic_id=self.kwargs['pk']).order_by('created_at')

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)


class TopicLastPostsListAPIView(generics.ListAPIView):
    queryset = Post.objects.all()
    serializer_class = TopicPostsSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Post.objects.filter(topic_id=self.kwargs['pk']).order_by('created_at')[:10]


class PostEditAPIView(generics.UpdateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostEditSerializer
    permission_classes = [IsAuthenticated]

    def partial_update(self, request, *args, **kwargs):
        post = Post.objects.get(pk=self.kwargs['pk'])
        if post.created_by_id == request.user.id:
            return super().partial_update(request, *args, **kwargs)
        else:
            return Response({'detail': 'access denied'}, status=status.HTTP_403_FORBIDDEN)


# class PostCreateAPIView(generics.CreateAPIView):
#     queryset = Post.objects.all()
#     serializer_class = TopicPostsSerializer
#     permission_classes = [IsAuthenticated]


class ExportTopicsToCSV(View):
    def get(self, request, pk=None):
        print(self.kwargs)
        print(pk)
        response = HttpResponse(content_type='text/csv')
        response['Access-Control-Expose-Headers'] = 'Content-Disposition'
        response['Content-Disposition'] = 'attachment; filename="topics.csv"'

        writer = csv.writer(response)
        writer.writerow(['Topic', 'Starter', 'Replies', 'Views', 'Last Update'])

        topics = Topic.objects.filter(board_id=pk).order_by('-last_updated').annotate(
            replies=Count('posts') - 1).values_list('subject', 'starter__username', 'replies', 'views', 'last_updated')

        for topic in topics:
            writer.writerow(topic)

        return response


class ExportTopicsToPDF(APIView):
    def get(self, request, pk=None):
        topics = Topic.objects.filter(board_id=pk).order_by('-last_updated').annotate(
            replies=Count('posts') - 1)
        html_string = render_to_string('topics_pfd_template.html', {'topics': topics})

        html = HTML(string=html_string)
        pdf_file = html.write_pdf()

        response = HttpResponse(pdf_file, content_type='application/pdf')
        response['Access-Control-Expose-Headers'] = 'Content-Disposition'
        response['Content-Disposition'] = 'attachment; filename="topics.pdf"'

        return response
