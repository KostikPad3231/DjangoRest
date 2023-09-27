from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from accounts.models import User, Blogger, Reader


class ProfileBloggerInline(admin.StackedInline):
    model = Blogger
    can_delete = False
    verbose_name_plural = 'Profile'
    fk_name = 'user'


class ProfileReaderInline(admin.StackedInline):
    model = Reader
    can_delete = False
    verbose_name_plural = 'Profile'
    fk_name = 'user'


class CustomUserAdmin(UserAdmin):
    inlines = (ProfileBloggerInline, ProfileReaderInline)

    list_display = UserAdmin.list_display + ('is_blogger', 'is_reader')
    fieldsets = UserAdmin.fieldsets + (
        ('User type', {
            'fields': ['is_blogger', 'is_reader']
        }),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('User type', {
            'fields': ['is_blogger', 'is_reader']
        }),
    )


admin.site.register(User, CustomUserAdmin)
