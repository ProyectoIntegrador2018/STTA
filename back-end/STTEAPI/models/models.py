# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey has `on_delete` set to the desired behavior.
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models
from django.utils.timezone import now
# TODO FIX DATEFIELD initilization error: should be 'YYYY-MM-DD',
# instead is 'YYYY-MM-DD HR:MIN:SEC'


class Administrador(models.Model):
    nombre = models.CharField(max_length=100, blank=True, null=True)
    usuario = models.ForeignKey('Usuario', on_delete=models.CASCADE,
                                db_column='usuario')

    class Meta:
        managed = True
        db_table = 'Administrador'


class Alumno(models.Model):
    matricula = models.CharField(max_length=100, blank=True, null=False)
    nombre = models.CharField(max_length=100, blank=True, null=True)
    siglas_carrera = models.CharField(max_length=100, blank=True, null=True)
    carrera = models.CharField(max_length=100, blank=True, null=True)
    semestre = models.IntegerField(blank=True, null=True)
    periodo_de_aceptacion = models.CharField(max_length=100, blank=True,
                                             null=True)
    posible_graduacion = models.CharField(max_length=100, blank=True,
                                          null=True)
    fecha_de_nacimiento = models.CharField(max_length=100, blank=True,
                                           null=True)
    nacionalidad = models.CharField(max_length=100, blank=True, null=True)
    usuario = models.ForeignKey('Usuario', on_delete=models.CASCADE,
                                db_column='usuario')

    class Meta:
        managed = True
        db_table = 'Alumno'


class Documento(models.Model):
    nombre = models.CharField(max_length=100, blank=True, null=True)
    fecha = models.DateTimeField(default=now, blank=True, null=True)
    contenido = models.TextField(blank=True, null=True)
    administrador = models.ForeignKey(Administrador,
                                      on_delete=models.DO_NOTHING,
                                      db_column='administrador',
                                      null=True)

    class Meta:
        managed = True
        db_table = 'Documento'


class Proceso(models.Model):
    nombre = models.CharField(max_length=100, blank=True, null=True)
    num_pasos = models.IntegerField(blank=True, null=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True, blank=True,
                                          null=True)
    fecha_modificacion = models.DateTimeField(auto_now_add=True, blank=True,
                                              null=True)
    administrador = models.ForeignKey(Administrador,
                                      on_delete=models.DO_NOTHING,
                                      db_column='administrador',
                                      null=True)

    class Meta:
        managed = True
        db_table = 'Proceso'


class Paso(models.Model):
    nombre = models.CharField(max_length=100, blank=True, null=True)
    numero = models.IntegerField(blank=True, null=True)
    mostrar = models.BooleanField(blank=True, null=True)
    proceso = models.ForeignKey(Proceso, on_delete=models.DO_NOTHING,
                                db_column='proceso')

    class Meta:
        managed = True
        db_table = 'Paso'


class Tramitealumno(models.Model):
    fecha_creacion = models.DateTimeField(auto_now_add=True, blank=True,
                                          null=True)
    fecha_modificacion = models.DateTimeField(auto_now_add=True, blank=True,
                                              null=True)
    numero_ticket = models.IntegerField(default=0, null=False, unique=True)
    encuesta = models.IntegerField(default=0, null=False)

    proceso = models.ForeignKey(Proceso, models.DO_NOTHING,
                                db_column='proceso')
    paso = models.ForeignKey(Paso, models.DO_NOTHING, db_column='paso')
    alumno = models.ForeignKey(Alumno, models.DO_NOTHING, db_column='alumno')
    administrador = models.ForeignKey(Administrador, models.DO_NOTHING,
                                      db_column='administrador', null=True)

    class Meta:
        managed = True
        db_table = 'TramiteAlumno'


# Nuevos modelos LBRL
class Carta(models.Model):
    nombre = models.CharField(max_length=255, blank=True, null=True)
    descripcion = models.TextField(blank=True, null=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True, blank=True,
                                          null=True)
    fecha_modificacion = models.DateTimeField(auto_now_add=True, blank=True,
                                              null=True)
    administrador = models.ForeignKey(Administrador,
                                      on_delete=models.DO_NOTHING,
                                      db_column='administrador',
                                      null=True)
   
    class Meta:
        managed = True
        db_table = 'Carta'


class CartaAlumno(models.Model):
    fecha_creacion = models.DateTimeField(auto_now_add=True, blank=True,
                                          null=True)
    fecha_terminacion = models.DateTimeField(auto_now_add=True, blank=True,
                                             null=True)
    carta = models.ForeignKey(Carta, models.DO_NOTHING, db_column='carta')
    alumno = models.ForeignKey(Alumno, models.DO_NOTHING, db_column='alumno')
    administrador = models.ForeignKey(Administrador, models.DO_NOTHING,
                                      db_column='administrador',
                                      null=True)

    class Meta:
        managed = True
        db_table = 'CartaAlumno'
