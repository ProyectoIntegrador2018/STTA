# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey has `on_delete` set to the desired behavior.
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models
from django.utils.timezone import now


class Administrador(models.Model):
    nombre = models.CharField(max_length=100, blank=True, null=True)
    usuario = models.ForeignKey('Usuario', on_delete=models.CASCADE, db_column='usuario')

    class Meta:
        managed = False
        db_table = 'Administrador'


class Alumno(models.Model):
    nombre = models.CharField(max_length=100, blank=True, null=True)
    apellido = models.CharField(max_length=100, blank=True, null=True)
    usuario = models.ForeignKey('Usuario', on_delete=models.CASCADE, db_column='usuario')

    class Meta:
        managed = False
        db_table = 'Alumno'


class Documento(models.Model):
    nombre = models.CharField(max_length=100, blank=True, null=True)
    fecha = models.DateTimeField(default=now, blank=True, null=True)
    admin = models.ForeignKey(Administrador, on_delete=models.DO_NOTHING, db_column='admin')
    contenido_subido = models.TextField(blank=True, null=True)
    proceso = models.ForeignKey('Proceso', on_delete=models.DO_NOTHING, db_column='proceso')

    class Meta:
        managed = False
        db_table = 'Documento'


class Paso(models.Model):
    proceso = models.ForeignKey('Proceso', on_delete=models.CASCADE, db_column='proceso')
    nombre = models.CharField(max_length=100, blank=True, null=True)
    columna_csv = models.IntegerField(blank=True, null=True)
    nombre_mostrar = models.CharField(max_length=100, blank=True, null=True)
    mostrar = models.IntegerField(blank=True, null=True)
    numero = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'Paso'


class Proceso(models.Model):
    nombre = models.CharField(max_length=100, blank=True, null=True)
    fecha = models.DateTimeField(default=now,blank=True, null=True)
    columna_matricula = models.IntegerField(blank=True, null=True)
    columna_ticket = models.IntegerField(blank=True, null=True)
    columna_fecha_inicio = models.IntegerField(blank=True, null=True)
    columna_fecha_ultima_actualizacion = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'Proceso'

#                                                           #
class Tramitealumno(models.Model):
    id = models.IntegerField(primary_key=True)

    proceso = models.ForeignKey(Proceso, models.DO_NOTHING, db_column='proceso')
    alumno = models.ForeignKey(Alumno, models.DO_NOTHING, db_column='alumno')
    paso_actual = models.ForeignKey(Paso, models.DO_NOTHING, db_column='paso_actual')

    matricula = models.CharField(max_length=10, blank=True, null=True)
    numero_ticket = models.IntegerField(null=False, unique=True)
    numero_paso_actual = models.IntegerField(null=False, unique=True)
    fecha_inicio = models.DateTimeField(blank=True, null=True)
    fecha_ultima_actualizacion = models.DateTimeField(blank=True, null=True)
    encuesta  = models.IntegerField(default=0, null=False)
    class Meta:
        managed = False
        db_table = 'TramiteAlumno'

