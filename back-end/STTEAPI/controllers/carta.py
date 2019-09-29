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
    # Local Directory ??? ಠ_ಠ
    templateFolder = ('/Users/luisrosales/Documents/School/Junio2019/'
                      'ProyectoIntegrador/Desarrollo/Proyectos/'
                      'SistemaDeTrazabilidad/Codigo/autoservicio-cartas-back/'
                      'STTEAPI/templates/')
    with open(templateFolder + uploadedFile.name, 'wb+') as destination:
        for chunk in uploadedFile.chunks():
            destination.write(chunk)


# API functions
@api_view(["POST"])
# @permission_classes((IsAuthenticated, EsAdmin))
def create_letter_template(request):
    """Create letter template in db.

    Args:
    request: API request.
    """
    # Validate body parameters
    args = verify_post_params(request, ['id_admin', 'descripcion'])

    print(args['id_admin'])
    print(args['descripcion'])

    # Save file to templates
    uploadedFile = request.FILES['file']
    handle_uploaded_file(uploadedFile)

    args = args.__dict__()

    ts = datetime.now().timestamp()

    # Submit created letter data to db
    Carta.objects.create(creado_por=args['id_admin'], nombre=uploadedFile.name,
                         descripcion=args['descripcion'], fecha_creacion=ts,
                         fecha_modificacion=ts,
                         modificado_por=args['id_admin'])

    return JsonResponse({'message': 'File uploaded successfully'})


# READ
# UPDATE
# DELETE
@api_view(["POST"])
@permission_classes((IsAuthenticated, EsAdmin))
@transaction.atomic
def eliminar_plantilla_carta(request):
    """Returns JSON response from deleting a letter template.

    Args:
    request: API request.
    """
    return eliminar_datos(request, Carta, 'cartas')
