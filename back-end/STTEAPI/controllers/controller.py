from django.core.mail import send_mail
from rest_framework.decorators import api_view, permission_classes
from STTEAPI.controllers.utils import *
from STTEAPI.settings.authentication import IsAuthenticated
from STTEAPI.settings.password_token import PasswordToken


@api_view(["POST"])
@permission_classes((IsAuthenticated,))
def logout(request):
    """Cierra la sesión del usuario actuale.

    Args:
    request: API request.
    """
    request.user.auth_token.delete()
    return JsonResponse("SESION CERRADA de " + request.user.email, safe=False)


@api_view(["POST"])
def request_restore(request):
    """Envía la respuesta html para restablecer la contraseña.

    Args:
    request: API request.
    """
    def _email_password_reset_plaintext(data):
        return ('Hola,\n\nEste mensaje es para restablecer tu contraseña. '
                'Si no solicitaste restablecer tu contraseña, ignora este '
                'mensaje.\n\nhttps://www.tramitesescolares.com.mx/'
                'restaurar/{0}').format(data)

    args = verify_post_params(request, ['email'])
    url_data = PasswordToken.request_uid_token(args['email'])
    try:
        send_mail('Restablece tu contraseña',
                  _email_password_reset_plaintext(url_data.uid + '/' +
                                                  url_data.token),
                  'tramites.escolares@tec.mx', [request.data['email']],
                  fail_silently=False)
    except:
        raise APIExceptions.SendMailError

    return JsonResponse(1, safe=False)


@api_view(["POST"])
def reset_password(request):
    """Verificar que el reseteo de la contraseña sea válido.

    Si es así entonces manda un check, si no manda una excepción.

    Args:
    request: API request.
    """
    args = verify_post_params(request, ['uid', 'token', 'password'])
    check = PasswordToken.reset_password(args['uid'], args['token'],
                                         args['password'])

    if check:
        check.is_active = True
        check.save()
        return JsonResponse(1 if check and check.es_admin else 2, safe=False)
    else:
        raise APIExceptions.InvalidToken.set(
            detail="Reseteo de contraseña inválido")


@api_view(["POST"])
def validate_password_token(request):
    """Valida los tokens de contraseña proporcionados.

    Args:
    request: API request.
    """
    args = verify_post_params(request, ['uid', 'token'])
    user = PasswordToken.validate_token(args['uid'], args['token'])

    if user is None:
        raise APIExceptions.InvalidUIdToken
    else:
        return JsonResponse(1, safe=False)
