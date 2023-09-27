from django.contrib import admin

from accounts.models import Category
from .models import Board


class BoardAdmin(admin.ModelAdmin):
    list_display = ['name', 'description', 'is_active']
    actions = ['make_inactive', 'make_active']

    @admin.action(description='Mark selected boards as inactive')
    def make_inactive(self, request, queryset):
        queryset.update(is_active=False)

    @admin.action(description='Mark selected boards as active')
    def make_active(self, request, queryset):
        queryset.update(is_active=True)


admin.site.register(Board, BoardAdmin)
admin.site.register(Category)
