from django.core.mail import send_mail

from celery import shared_task


@shared_task
def send_email(email_to, subject, message):
    send_mail(
        subject,
        message,
        'webmaster@localhost',
        [email_to],
        fail_silently=False
    )
