from django.db import transaction
from rest_framework.decorators import api_view, permission_classes
from STTEAPI.controllers.utils import *
from STTEAPI.settings.authentication import IsAuthenticated


# CREATE
# READ
def return_tramite(request, proceso):
    """Regresa tramites en formato de diccionario.

    Args:
    request: API request.
    """
    del request
    query = ("SELECT ta.id, fecha_inicio, fecha_ultima_actualizacion, "
             "numero_ticket, pr.nombre, paso_actual, "
             "IF(paso_actual=count(p.id),'TERMINADO', "
             "IF(paso_actual=0,'INICIADO','ENPROCESO')) as status "
             "FROM TramiteAlumno ta join Proceso pr "
             "on ta.proceso = pr.id join "
             "Paso p on ta.proceso=p.proceso "
             "WHERE pr.nombre= '{0}' group by numero_ticket;")
    return run_db_query(query.format(proceso))


@api_view(["GET", "POST"])
# @permission_classes((IsAuthenticated, EsAdmin))
def return_datos_tramite(request):
    """Recupera los datos del tramite y se envían en formato json.

    Args:
    request: API request.
    """
    del request
    tra = Tramitealumno.objects.select_related('proceso').values(
        'id', 'matricula', 'numero_ticket', 'fecha_inicio',
        'numero_paso_actual', 'proceso__nombre', 'fecha_ultima_actualizacion')
    tra = [dict(t) for t in tra]
    return JsonResponse(tra, safe=False)


@api_view(["GET"])
# @permission_classes((IsAuthenticated, EsAdmin))
def return_tramite_alumnos(request, matricula):
    """Regresa los tramites de alumnos.

    Los atributos de fecha de inicio, fecha de ultima actualizacion, nombre de
    proceso, paso actual del trámite actual dada una matricula de usuario en
    formato de diccionario.

    Args:
    request: API request.
    matricula: Student ID.
    """
    del request
    query = ("SELECT ta.id, pr.nombre, alumno, paso_actual, "
             "numero_paso_actual, fecha_inicio, "
             "fecha_ultima_actualizacion, numero_ticket, "
             "matricula, encuesta, count(p.id) as pasos, "
             "IF(paso_actual=count(p.id),'TERMINADO', "
             "IF(paso_actual=0,'INICIADO','ENPROCESO')) as status "
             "FROM TramiteAlumno ta join Proceso pr "
             "on ta.proceso = pr.id join "
             "Paso p on ta.proceso=p.proceso where matricula = '{0}' "
             "group by numero_ticket;")
    return run_db_query(query.format(matricula))


def return_tramite_transferencia(request):
    """Regresa los tramites de transferencia.

    Los atributos de fecha de inicio, fecha de ultima actualizacion,
    nombre de proceso,paso actual del trámite actual donde el nombre del
    proceso se llame Transferencia en formato de diccionario.

    Args:
    request: API request.
    """
    del request
    query = ("SELECT ta.id, fecha_inicio, fecha_ultima_actualizacion, "
             "numero_ticket, pr.nombre, paso_actual, "
             "IF(paso_actual=count(p.id),'TERMINADO', "
             "IF(paso_actual=0,'INICIADO','ENPROCESO')) as status "
             "FROM TramiteAlumno ta join Proceso pr "
             "on ta.proceso = pr.id join "
             "Paso p on ta.proceso=p.proceso WHERE pr.nombre='Transferencia' "
             "group by numero_ticket;")
    return run_db_query(query)


def return_tramite_transferencia_pasos(request):
    """Regresa los pasos de tramites de transferencia.

    Los nombres de los pasos y proceso donde el nombre del
    proceso se llame Transferencia en formato de diccionario

    Args:
    request: API request.
    """
    del request
    query = ('SELECT pr.nombre, p.nombre '
             'FROM Paso p join Proceso pr on p.proceso=pr.id '
             'WHERE pr.nombre="Transferencia";')
    return run_db_query(query)


def get_tramites_resumen(request, proceso, month, status):
    """Regresa todas las columnas de ResumenTramites en formato de diccionario.

    Args:
    request: API request.
    proceso: Process #.
    month: Month #.
    status: Status #.
    """
    del request
    query = 'SELECT * FROM STTE.ResumenTramites WHERE proceso = {0};'
    where = ''
    if month != "0":
        where += ' and month = {0}'.format(month)
    if status != "-1":
        where += ' and status = {0}'.format(status)
    return run_db_query(query.format(proceso) + where + ';')


@api_view(["GET"])
# @permission_classes((IsAuthenticated, EsAdmin))
def return_tramite_alumnos_status(request):
    """Regresa todos los atributos del trámite actual del alumno.

    Args:
    request: API request.
    """
    del request
    query = ("SELECT ta.id, pr.nombre, alumno, paso_actual, "
             "fecha_inicio, fecha_ultima_actualizacion, "
             "numero_ticket, matricula, encuesta, count(p.id) as pasos, "
             "IF(paso_actual=count(p.id),'TERMINADO', "
             "IF(paso_actual=0,'INICIADO','ENPROCESO')) as status "
             "FROM TramiteAlumno ta join Proceso pr "
             "on ta.proceso = pr.id join "
             "Paso p on ta.proceso=p.proceso "
             "where year(now()) = year(fecha_ultima_actualizacion) "
             "and month(now()) = month(fecha_ultima_actualizacion) "
             "group by numero_ticket;")
    return run_db_query(query)


@api_view(["GET"])
# @permission_classes((IsAuthenticated, EsAdmin))
def return_tramite_alumnos_status_week(request):
    """Regresa todos los atributos de tramite actual por semana.

    Args:
    request: API request.
    """
    del request
    query = ("SELECT ta.id, pr.nombre, alumno, paso_actual, "
             "fecha_inicio, fecha_ultima_actualizacion, "
             "numero_ticket, matricula, encuesta, count(p.id) as pasos, "
             "IF(paso_actual=count(p.id),'TERMINADO', "
             "IF(paso_actual=0,'INICIADO','ENPROCESO')) as status "
             "FROM TramiteAlumno ta join Proceso pr "
             "on ta.proceso = pr.id join "
             "Paso p on ta.proceso=p.proceso where "
             "week(now()) - 1 = week(fecha_ultima_actualizacion) "
             "group by numero_ticket;")
    return run_db_query(query)


@api_view(["GET"])
@permission_classes((IsAuthenticated, EsAlumno | EsAdmin))
def get_datos_tramite_alumno(request, id):
    """Regresa datos sobre el proceso del trámite actual.

    Args:
    request: API request.
    """
    del request
    tra = Tramitealumno.objects.select_related('proceso').values(
        'id', 'matricula', 'numero_ticket', 'proceso__nombre', 'proceso_id',
        'fecha_inicio', 'paso_actual', 'numero_paso_actual',
        'fecha_ultima_actualizacion').filter(id=id)
    tra = [dict(t) for t in tra]
    return JsonResponse(tra, safe=False)


# UPDATE
# DELETE
@api_view(["POST"])
@permission_classes((IsAuthenticated, EsAdmin))
@transaction.atomic
def eliminar_tramites(request):
    """Returns JSON response from deleting tramitealumnos.

    Args:
    request: API request.
    """
    return eliminar_datos(request, Tramitealumno, 'tramites')
