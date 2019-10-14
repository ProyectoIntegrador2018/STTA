from rest_framework.decorators import api_view, permission_classes
from STTEAPI.controllers.utils import *
from STTEAPI.settings.authentication import IsAuthenticated


# CREATE
# READ
@api_view(["GET"])
@permission_classes((IsAuthenticated, EsAlumno | EsAdmin))
def get_pasos_proceso(request, proceso):
    """Regresa todos los atributos de Paso en formato de diccionario.

    Args:
    request: API request.
    """
    del request
    tra = Paso.objects.filter(
        proceso_id=proceso).order_by('numero').values()
    tra = [dict(t) for t in tra]
    return JsonResponse(tra, safe=False)

# UPDATE
# DELETE
