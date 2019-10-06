from datetime import datetime
from django.db import transaction
from rest_framework.decorators import api_view, permission_classes
from STTEAPI.controllers.utils import *
from STTEAPI.settings.authentication import IsAuthenticated


# CREATE
def handle_uploaded_file(uploadedFile):
    """Handles file upload.

    Args:
    uploadedFile: file.
    """
    templateFolder = 'STTEAPI/templates/'
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
# UPDATE
# DELETE
@api_view(["POST"])
@permission_classes((IsAuthenticated, EsAdmin))
@transaction.atomic
def eliminar_plantilla_carta(request):
    """Finds and deletes a letter template.

    Args:
    request: API request.
    """
    return eliminar_datos(request, Carta, 'cartas')
