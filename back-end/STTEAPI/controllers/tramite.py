from django.db import transaction
from rest_framework.decorators import api_view, permission_classes
from STTEAPI.controllers.utils import *
from STTEAPI.settings.authentication import IsAuthenticated


# CREATE
# READ
@api_view(["GET"])
@permission_classes((IsAuthenticated, EsAdmin))
def get_tramites(request):
    """Recupera los datos del tramite y se envían en formato json.

    Args:
    request: API request.
    """
    del request
    tra = Tramitealumno.objects.select_related('proceso', 'alumno',
                                               'paso').values(
        'id', 'fecha_creacion', 'fecha_modificacion', 'alumno__matricula',
        'paso__numero', 'proceso__nombre', 'numero_ticket')
    tra = [dict(t) for t in tra]
    return JsonResponse(tra, safe=False)


@api_view(["GET"])
@permission_classes((IsAuthenticated, EsAlumno))
def get_tramites_by_student_id(request, id):
    """Recupera los datos del tramite y se envían en formato json.

    Args:
    request: API request.
    """
    del request
    tra = Tramitealumno.objects.select_related('proceso', 'paso',
                                               'alumno').values(
        'id', 'fecha_creacion', 'fecha_modificacion',
        'proceso__num_pasos', 'paso__numero', 'proceso__nombre',
        'numero_ticket').filter(alumno__matricula=id)
    tra = [dict(t) for t in tra]
    return JsonResponse(tra, safe=False)


@api_view(["GET"])
@permission_classes((IsAuthenticated, EsAlumno | EsAdmin))
def get_tramite_by_proceso(request, proceso_id):
    """Regresa datos sobre el proceso del trámite actual.

    Args:
    request: API request.
    """
    del request
    tra = Tramitealumno.objects.select_related('proceso', 'alumno',
                                               'paso').values(
        'id', 'proceso__id', 'alumno__matricula', 'numero_ticket',
        'fecha_creacion', 'paso__id', 'paso__numero', 'proceso__nombre',
        'fecha_modificacion').filter(id=proceso_id)
    tra = [dict(t) for t in tra]
    return JsonResponse(tra, safe=False)


@api_view(["GET"])
@permission_classes((IsAuthenticated, EsAdmin))
def get_tramites_resumen(request, proceso, month, status):
    """Regresa todas las columnas de ResumenTramites en formato de diccionario.

    Args:
    request: API request.
    proceso: Process #.
    month: Month #.
    status: Status #.
    """
    del request

    query = ("SELECT t.paso, p.numero, Count(*) as num_tramites, "
             "SUM(DATEDIFF(t.fecha_modificacion, t.fecha_creacion)) as "
             "num_days, "
             "IF(p.numero = pr.num_pasos, 2, "
             "IF(p.numero = 0, 0, 1)) AS status "
             "FROM TramiteAlumno t JOIN Paso p ON t.paso = p.id "
             "JOIN Proceso pr ON t.proceso = pr.id "
             "WHERE t.proceso = {0} "
             "GROUP BY t.paso, p.numero "
             "ORDER BY p.numero;")

    status_clause = {'0': ' and p.numero = 0 ',
                     '1': ' and p.numero > 0 and p.numero < pr.num_pasos ',
                     '2': ' and p.numero = pr.num_pasos '}
    if month != "0":
        month_clause = ' and month(t.fecha_modificacion) = {0} '.format(month)
    else:
        month_clause = ''

    where = month_clause + status_clause.get(status, '')

    return run_db_query(query.format(proceso + where))


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
