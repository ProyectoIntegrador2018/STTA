from rest_framework.exceptions import *
from rest_framework import exceptions
from rest_framework import status
from rest_framework.views import exception_handler


def api_exception_handler(exc, context):
    # Call REST framework's default exception handler first,
    # to get the standard error response.
    response = exception_handler(exc, context)

    # Now add the HTTP status code to the response.
    if response is not None:
        response.data['status_code'] = response.status_code
        response.data['status_text'] = response.status_text
        if response.data['detail'] is None:
            response.data['detail'] = "Detail undefinded"
        if not 'error_code' in response.data or response.data['error_code'] is None:
            response.data['error_code'] = "Error code undefinded"
    return response

class APIBaseException(APIException):
    status_code = status.HTTP_417_EXPECTATION_FAILED
    default_detail = {'error_code': 'E0', 'detail': 'EXPECTATION_FAILED'}
    default_code = 'E0'
    default_text_detail = "EXPECTATION_FAILED"

    def __init__(self, error_code=default_code, detail=default_text_detail, status_code=status_code):
        self.status_code = status_code
        self.default_detail = {'error_code': error_code, 'detail': detail}
        self.default_code = error_code
        super(APIBaseException, self).__init__()

    def set(self, error_code=default_code, detail=default_text_detail, status_code=status_code):
        self.status_code = status_code
        self.default_detail = {'error_code': error_code, 'detail': detail}
        self.default_code = error_code
        super(APIBaseException, self).__init__()
        return self


class APIExceptions:
    PermissionDenied = exceptions.PermissionDenied(detail="ee")
    DataBase = APIBaseException(error_code="E1", detail="D")
    InvalidToken = APIBaseException(error_code="E100", detail="Token inválido o expirado")
    InvalidUIdToken = APIBaseException(error_code="E110", detail="Usuario no encontrado")
    SendMailError = APIBaseException(error_code="E200", detail="El correo no pudo ser enviado")
