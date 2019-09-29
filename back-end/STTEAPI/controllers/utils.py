from django.http import JsonResponse
from django.db import IntegrityError
from django.db.models import F
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from STTEAPI.models import *
from STTEAPI.settings.exceptions import *
from STTEAPI.tools.parameters_list import PostParametersList

EMAIL_REGEX = r"^(a|A)[0-9]{8}@(itesm.mx|tec.mx)$"


def verify_post_params(request, keys, is_json=False):
    args = PostParametersList(request)
    for key_name in keys:
        args.check_parameter(key=key_name, required=True, is_json=is_json)
    return args


def eliminar_con_id(model, p):
    """Delete from db using id.

    Args:
    model: The mysql model object.
    p: dictionanary of values.
    """
    doc = model.objects.get(id=p['id'])
    doc.delete()


def eliminar_usuarios(model, p):
    """Delete from db using id, then usuario_id.

    Args:
    model: The mysql model object.
    p: dictionary of values.
    """
    doc = model.objects.get(id=p['id'])
    user = Usuario.objects.get(id=doc.usuario_id)
    user.delete()
    doc.delete()
    return JsonResponse(1, safe=False)


def eliminar_datos(request, model, key_name, deletion_func=eliminar_con_id):
    """Returns JSON response from deleting a db record.

    Args:
    request: API request.
    """
    args = verify_post_params(request, [key_name], True)
    for p in args[key_name]:
        try:
            deletion_func(model, p)
        except IntegrityError:
            raise APIExceptions.PermissionDenied

    return JsonResponse(1, safe=False)


def check_valid_user(user, model):
    if user is None:
        raise exceptions.AuthenticationFailed(
            detail="Credenciales incorrectas")
    if not user.es_admin and model == Administrador:
        raise exceptions.PermissionDenied(detail="Permisos insuficientes")
    if not user.es_alumno and model == Alumno:
        raise exceptions.PermissionDenied(detail="Permisos insuficientes")


def handle_login(request, model):
    """Handles generic login for user.

    Args:
    request: API request.
    model: The mysql model object.
    """
    email = request.POST.get('email', '')
    password = request.POST.get('password', '')
    user = authenticate(username=email, password=password)
    check_valid_user(user, model)
    token, _ = Token.objects.get_or_create(user=user)
    logged_in_user = model.objects.get(usuario=user)
    user.last_login = now()
    user.save()
    return logged_in_user, user, token


def run_db_query(query):
    """Helper function to run a sql query.

    Args:
    query: Query string.
    """
    from django.db import connection
    cursor = connection.cursor()
    cursor.execute(query)
    tra = [dict(zip([col[0] for col in cursor.description], row))
           for row in cursor.fetchall()]
    return JsonResponse(tra, safe=False)


def return_user_list(user_type):
    users = user_type.objects.select_related('usuario').values(
        'id', 'nombre', 'usuario__id', email=F('usuario__email'),
        last_login=F('usuario__last_login'))
    users = [dict(user) for user in users]
    return JsonResponse(users, safe=False)
