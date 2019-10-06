from django.db.models import Count
from django.db import transaction
from rest_framework.decorators import api_view, permission_classes
from STTEAPI.controllers.utils import *
from STTEAPI.settings.authentication import IsAuthenticated
from datetime import datetime


# CREATE
@api_view(["POST"])
@permission_classes((IsAuthenticated, EsAdmin))
@transaction.atomic
def create_proceso(request):
    args = PostParametersList(request)
    args.check_parameter(key='nombre', required=True)
    args.check_parameter(key='pasos', required=True, is_json=True)
    proceso = Proceso.objects.create(nombre=args['nombre'])
    for paso in args['pasos']:
        handle_create_paso(paso, proceso)
    return JsonResponse(1, safe=False)


def handle_create_paso(paso, proceso):
    Paso.objects.create(nombre=paso['nombre'],
                        numero=paso['numero'],
                        mostrar=paso['mostrar'],
                        proceso=proceso)

# READ
@api_view(["POST"])
@permission_classes((IsAuthenticated, EsAdmin))
def get_procesos(request):
    del request
    procs = Proceso.objects.values()
    procs = [dict(p) for p in procs]
    return JsonResponse(procs, safe=False)


@api_view(["GET"])
@permission_classes((IsAuthenticated, EsAdmin))
def get_proceso(request, id):
    del request
    procs = Proceso.objects.filter(id=id).values()
    procs = [dict(p) for p in procs]
    return JsonResponse(procs, safe=False)


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
@api_view(["POST"])
@permission_classes((IsAuthenticated, EsAdmin))
def update_proceso(request):
    args = verify_post_params(request, ['id', 'nombre'], True)
    proc = Proceso.objects.get(id=args['id'])
    proc.nombre = args['nombre']
    proc.fecha_modificacion = datetime.now()
    proc.save()


# DELETE
@api_view(["POST"])
@permission_classes((IsAuthenticated, EsAdmin))
@transaction.atomic
def delete_procesos(request):
    args = verify_post_params(request, ['procesos'], True)
    for p in args['procesos']:
        try:
            pasos = Paso.objects.filter(proceso=p['id'])
            for paso in pasos:
                paso.delete()
            doc = Proceso.objects.get(id=p['id'])
            doc.delete()
        except IntegrityError:
            raise APIExceptions.PermissionDenied

    return JsonResponse(1, safe=False)