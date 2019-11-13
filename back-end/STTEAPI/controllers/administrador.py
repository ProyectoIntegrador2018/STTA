from django.db import transaction
from rest_framework.decorators import api_view, permission_classes
from STTEAPI.controllers.utils import *
from STTEAPI.settings.authentication import IsAuthenticated


# CREATE
@api_view(["POST"])
@permission_classes((IsAuthenticated, EsAdmin))
def registro_administradores(request):
    """Registra un administrador.

    Args:
    request: API request.
    """
    args = verify_post_params(request, ['email', 'nombre', 'password'])
    try:
        user = Usuario.objects.create_admin(email=args['email'],
                                            password=args['password'],
                                            nombre=args['nombre'])
    except IntegrityError as e:
        raise exceptions.PermissionDenied(detail="Email ya registrado")
    return JsonResponse(1, safe=False)


# READ
@api_view(["POST"])
def login_admin(request):
    """Corrobora las credenciales en el inicio de sesión del administrador.

    Args:
    request: API request.
    """
    admin, user, token = handle_login(request, Administrador)
    return JsonResponse({'token': token.key, 'nombre': admin.nombre,
                         'email': user.email, 'id': admin.id,
                         'is_superuser': user.is_superuser}, safe=False)


@api_view(["GET"])
@permission_classes((IsAuthenticated, EsAdmin))
def return_admin_list(request):
    """Regresa la lista entera de administradores.

    Args:
    request: API request.
    """
    del request
    return return_user_list(Administrador)


# UPDATE
# DELETE
@api_view(["POST"])
@permission_classes((IsAuthenticated, EsAdmin))
@transaction.atomic
def eliminar_administradores(request):
    """Returns JSON response from deleting admins.

    Args:
    request: API request.
    """
    def _set_to_none(model):
        objects = model.objects.filter(administrador=p['id'])
        for obj in objects:
            obj.administrador = None
            obj.save()

    args = verify_post_params(request, ['admin'], True)
    for p in args['admin']:
        try:
            _set_to_none(Carta)
            _set_to_none(CartaAlumno)
            _set_to_none(Tramitealumno)
            _set_to_none(Documento)
        except IntegrityError:
            raise APIExceptions.PermissionDenied
    return eliminar_datos(request, Administrador, 'admin', eliminar_usuarios)
