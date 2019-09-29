from rest_framework.decorators import api_view, permission_classes
from STTEAPI.controllers.utils import *
from STTEAPI.settings.authentication import IsAuthenticated


# CREATE
# READ
def get_pasos_proceso(request, proceso):
    """Regresa todos los atributos de Paso en formato de diccionario.

    Args:
    request: API request.
    """
    del request
    query = 'SELECT * FROM STTE.Paso WHERE proceso = {0};'
    return run_db_query(query.format(proceso))


@api_view(["POST"])
@permission_classes((IsAuthenticated, EsAlumno | EsAdmin))
def get_pasos_tramites(request):
    """Regresa los pasos del trámite dada el id en formato de diccionario.

    Args:
    request: API request.
    """
    args = verify_post_params(request, ['id'])
    tra = Paso.objects.filter(
        proceso_id=args['id']).order_by('numero').values()
    tra = [dict(t) for t in tra]
    return JsonResponse(tra, safe=False)


# UPDATE
# DELETE
