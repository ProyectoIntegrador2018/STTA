from .models import *
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.utils.timezone import now
from rest_framework.permissions import BasePermission

class MyUserManager(BaseUserManager):
    use_in_migrations = True

    def create_admin(self, email, password, **admin):
        user = self.model(email=email, is_staff=True, is_superuser=True, es_admin=True, is_active=False)
        user.set_password(password)
        user.save(using=self._db)
        pac = Administrador.objects.create(usuario=user)
        for key, val in admin.items():
            setattr(pac, key, val)
        pac.save()
        return pac

    def create_alumno(self, email, password, **alumno):
        user = self.model(email=email, is_staff=True, is_superuser=True, es_alumno=True)
        user.set_password(password)
        user.save(using=self._db)
        doc = Alumno.objects.create(usuario=user)
        for key, val in alumno.items():
            setattr(doc,key,val)
        doc.save()
        return doc

    # python manage.py createsuperuser
    def create_superuser(self, email, password):
        user = self.model(email=email, is_staff=True, is_superuser=True)
        user.set_password(password)
        user.save(using=self._db)
        return user


class EsAlumno(BasePermission):
    def has_permission(self, request, view):
        return request.user.es_alumno

class EsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.es_admin

class Usuario(AbstractBaseUser):
    username = None
    email = models.CharField( max_length=100, unique=True)
    password = models.CharField(max_length=100)
    last_login = models.DateTimeField( blank=True, null=True)
    is_superuser = models.IntegerField( default=False)
    is_staff = models.IntegerField( default=False)
    is_active = models.IntegerField(default=True)
    date_joined = models.DateTimeField( default=now)

    es_admin = models.IntegerField(default=False)
    es_alumno = models.IntegerField(default=False)

    USERNAME_FIELD = 'email'
    objects = MyUserManager()

    class Meta:
        managed = False
        db_table = 'Usuario'

    def has_perm(self, perm, obj=None):
        return self.is_staff

    # this methods are require to login super user from admin panel
    def has_module_perms(self, app_label):
        return self.is_staff