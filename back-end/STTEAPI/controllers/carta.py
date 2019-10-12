from datetime import datetime
from django.db import transaction
from rest_framework.decorators import api_view, permission_classes
from STTEAPI.controllers.utils import *
from STTEAPI.settings.authentication import IsAuthenticated
import os

templateFolder = 'STTEAPI/templates/'

# CREATE
def handle_uploaded_file(uploadedFile):
    """Handles file upload.

    Args:
    uploadedFile: file.
    """
    with open(templateFolder + uploadedFile.name, 'wb+') as destination:
        for chunk in uploadedFile.chunks():
            destination.write(chunk)


@api_view(["POST"])
# @permission_classes((IsAuthenticated, EsAdmin))
def create_letter_template(request):
    """Create letter template in db.

    Args:
    request: API request.
    """
    # Validate body parameters
    args = verify_post_params(request, ['id_admin', 'descripcion'])

    # Save file to templates
    uploadedFile = request.FILES['file']
    handle_uploaded_file(uploadedFile)
    args = args.__dict__()
    admin = Administrador.objects.get(id=args['id_admin'])
    # Submit created letter data to db
    Carta.objects.create(nombre=uploadedFile.name,
                         descripcion=args['descripcion'],
                         administrador=admin)

    return JsonResponse({'message': 'File uploaded successfully'})


# READ
@api_view(["GET"])
@permission_classes((IsAuthenticated, EsAlumno | EsAdmin))
def get_letters(request):
    """Queries administrator created letters.

    Args:
    request: API request.
    """
    del request
    query = ("SELECT a.id, a.nombre as nombre_carta, "
             "a.descripcion, a.fecha_creacion, b.nombre "
             "FROM Carta a LEFT JOIN Administrador b "
             "on a.administrador = b.id")
    return run_db_query(query)


# UPDATE
# DELETE
def handle_delete_local_file(file_name):
    os.remove(templateFolder + file_name)


@api_view(["POST"])
@permission_classes((IsAuthenticated, EsAdmin))
@transaction.atomic
def eliminar_plantilla_carta(request):
    """Finds and deletes a letter template.

    Args:
    request: API request.
    """
    args = verify_post_params(request, ['cartas'], True)
    for p in args['cartas']:
        try:
            carta_alumnos = CartaAlumno.objects.filter(carta=p['id'])
            for carta_alumno in carta_alumnos:
                carta_alumno.delete()

            carta = Carta.objects.get(id=p['id'])
            handle_delete_local_file(carta.nombre)
            carta.delete()
        except IntegrityError:
            raise APIExceptions.PermissionDenied

    return JsonResponse(1, safe=False)
