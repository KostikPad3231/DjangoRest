from allauth.account.adapter import DefaultAccountAdapter
from allauth.account.models import EmailAddress
from allauth.socialaccount.adapter import DefaultSocialAccountAdapter

from accounts.tasks import send_email


class SocialAccountAdapter(DefaultSocialAccountAdapter):
    def pre_social_login(self, request, sociallogin):
        # social account already exists, so this is just a login
        if sociallogin.is_existing:
            return

        user = sociallogin.user

        if not user.email:
            return

        # check if given email address already exists with email on
        # an existing user's account
        try:
            existing_email = EmailAddress.objects.get(email__iexact=user.email, verified=True)
        except EmailAddress.DoesNotExist:
            return

        # if it does, connect this new social login to the existing user
        sociallogin.connect(request, existing_email.user)
