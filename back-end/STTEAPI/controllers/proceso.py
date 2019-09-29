from django.db.models import Count
from django.db import transaction
from rest_framework.decorators import api_view, permission_classes
from STTEAPI.controllers.utils import *
from STTEAPI.settings.authentication import IsAuthenticated


# CREATE
@api_view(["POST"])
@permission_classes((IsAuthenticated, EsAdmin))
@transaction.atomic
def agregar_proceso(request):
    """Registra los procesos nuevos en la base de datos.

    Args:
    request: API request.
    """
    args = verify_post_params(request, ['nombre', 'ticket', 'fecha_apertura',
                                        'ultima_actualizacion', 'matricula',
                                        'pasos'], True)
    print(args['matricula'])

    proc = Proceso.objects.create(
        nombre=args['nombre'], columna_matricula=args['matricula']['key'],
        columna_ticket=args['ticket']['key'],
        columna_fecha_ultima_actualizacion=args['ultima_actualizacion']['key'],
        columna_fecha_inicio=args['fecha_apertura']['key'])

    for p in args['pasos']:
        print(p)
        p = Paso.objects.create(proceso=proc, nombre=p['nombre'],
                                columna_csv=p['columna_csv'],
                                nombre_mostrar=p['nombre_mostrar'],
                                mostrar=p['mostrar'], numero=p['numero'])

    return JsonResponse(1, safe=False)


# READ
@api_view(["POST"])
@permission_classes((IsAuthenticated, EsAdmin))
def procesos(request):
    """Cuenta los pasos de un proceso."""
    del request
    procs = Proceso.objects.values().annotate(pasos=Count('paso'))
    procs = [dict(p) for p in procs]
    return JsonResponse(procs, safe=False)


def return_procesos(request):
    """Regresa todos los atributos de Proceso en formato de diccionario.

    Args:
    request: API request.
    """
    del request
    query = 'SELECT * FROM Proceso pr'
    return run_db_query(query)


def return_procesos_pasos(request, proceso):
    """Regresa nombre de proceso y de paso en formato de diccionario.

    Args:
    request: API request.
    """
    del request
    query = ("SELECT pr.nombre, p.nombre FROM Paso p join Proceso pr "
             "on p.proceso = pr.id WHERE pr.nombre = '{0}';")
    return run_db_query(query.format(proceso))


# UPDATE
# DELETE
@api_view(["POST"])
@permission_classes((IsAuthenticated, EsAdmin))
@transaction.atomic
def borrar_procesos(request):
    """Returns JSON response from deleting documents.

    Args:
    request: API request.
    """
    return eliminar_datos(request, Proceso, 'procesos')
