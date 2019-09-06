from rest_framework.authentication import TokenAuthentication as TokenAuthenticationBase
from rest_framework.authtoken.models import Token
from rest_framework.exceptions import AuthenticationFailed
from django.utils.timezone import now
from datetime import timedelta
from rest_framework.permissions import BasePermission
from rest_framework import exceptions

class IsAuthenticated(BasePermission):
    def has_permission(self, request, view):
        if request.user and not request.user.is_anonymous and (now() - request.user.auth_token.created).total_seconds() >= 86000:
            request.user.auth_token.delete()
            raise exceptions.AuthenticationFailed('Session expired')  # raise exception if user does not exist
        return bool(request.user and request.user.is_authenticated)
