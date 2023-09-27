from rest_framework.pagination import PageNumberPagination


class StandardResultSetPagination(PageNumberPagination):
    page_size = 10
    page_query_param = 'page'
    page_size_query_param = 'page_size'
    last_page_strings = ('last',)
    max_page_size = 1000

    def paginate_queryset(self, queryset, request, view=None):
        if 'all' in request.query_params:
            return
        return super().paginate_queryset(queryset, request, view)
