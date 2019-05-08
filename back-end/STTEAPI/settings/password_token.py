from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.core.exceptions import ObjectDoesNotExist
from django.core.mail import send_mail
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from STTEAPI.settings.exceptions import *

user_model = get_user_model()

class URLData:
    def __init__(self, token=None,uid=None):
        self.token = token
        self.uid = uid


class PasswordToken:
    @staticmethod
    def request_uid_token(email):
        try:
            user = user_model.objects.get(email=email)
        except ObjectDoesNotExist:
            raise exceptions.PermissionDenied(detail='Correo no registrado')

        gen = PasswordResetTokenGenerator()
        token = gen.make_token(user)
        print(user.id)
        uid = urlsafe_base64_encode(force_bytes(user.id)).decode()
        return URLData(token=token, uid=uid)

    @staticmethod
    def reset_password(uid,token,new_password):
        user = PasswordToken.validate_token(uid, token)
        if user is None:
            raise APIExceptions.InvalidToken
            return None
        else:
            user.set_password(new_password)
            user.save()
            return user

    @staticmethod
    def validate_token(uid,token):
        uid = urlsafe_base64_decode(uid).decode()
        try:
            user = user_model.objects.get(id=uid)
        except ObjectDoesNotExist:
            raise APIExceptions.InvalidUIdToken
        gen = PasswordResetTokenGenerator()
        token = gen.check_token(user, token)
        if token:
            return user
        else:
            return None
