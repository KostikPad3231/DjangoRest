from allauth.account.models import EmailAddress
from allauth.socialaccount.adapter import DefaultSocialAccountAdapter


class SocialAccountAdapter(DefaultSocialAccountAdapter):
    def pre_social_login(self, request, sociallogin):
        print(type(sociallogin))
        print(type(sociallogin.user))
        print(dir(sociallogin))
        print(dir(sociallogin.user))
        print(sociallogin.user)
        print(sociallogin.user.email)
        print(1)
        # social account already exists, so this is just a login
        if sociallogin.is_existing:
            return

        print(4)
        user = sociallogin.user
        print(user.id)
        if not user.email:
            return

        print(5)
        # check if given email address already exists with email on
        # an existing user's account
        try:
            existing_email = EmailAddress.objects.get(email__iexact=user.email, verified=True)
        except EmailAddress.DoesNotExist:
            return

        print(6)
        # if it does, connect this new social login to the existing user
        sociallogin.connect(request, existing_email.user)
