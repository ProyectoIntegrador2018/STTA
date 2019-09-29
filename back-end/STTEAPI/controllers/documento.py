from datetime import datetime
import json

from django.core.mail import send_mail
from django.db import transaction
from rest_framework.decorators import api_view, permission_classes
from STTEAPI.controllers.utils import *
from STTEAPI.settings.authentication import IsAuthenticated


# CREATE
def email_text_for_completed_procedure(ticket_id):
    return ('Hola,\n\nEste mensaje es para avisarte que tu trámite #{0} '
            'ha sido completado el día de hoy.\n\nPor favor realiza la '
            'siguiente encuesta sobre tu experiencia '
            'https://forms.gle/GzcmC4f9cmFKS2ee9').format(ticket_id)


def _validate_date(contenido, date_name):
    if contenido[date_name]:
        try:
            return datetime.strptime(contenido[date_name], '%d/%m/%y')
        except Exception as e:
            raise exceptions.PermissionDenied(
                ("El formato de la fecha [ {0} ] es inválido. "
                 "El formato debe ser: D/M/A").format(
                    contenido[date_name]))
    else:
        return now()


def handle_update_tramite(paso, args, contenido, p_ok):
    fecha_1 = _validate_date(contenido, 'fecha_apertura')
    fecha_2 = _validate_date(contenido, 'fecha_ultima')
    num_results = Tramitealumno.objects.filter(
        numero_ticket=contenido['ticket']).count()
    if num_results > 0:
        tra = Tramitealumno.objects.filter(
            numero_ticket=contenido['ticket']).first()
        tra.fecha_ultima_actualizacion = fecha_2
        tra.paso_actual = paso
        tra.numero_paso_actual = p_ok
        tra.save()
    else:
        tra = Tramitealumno.objects.create(
            matricula=contenido['matricula'],
            numero_ticket=contenido['ticket'],
            proceso_id=args['proceso'], fecha_inicio=fecha_1,
            fecha_ultima_actualizacion=fecha_2, paso_actual=paso,
            numero_paso_actual=p_ok)


def get_last_valid_pass(contenido):
    p_ok = 0
    p = 1
    while (('paso_' + str(p)) in contenido):
        if contenido['paso_' + str(p)] == 'ok':
            p_ok = p
        p = p + 1
    return p_ok


@api_view(["POST"])
@permission_classes((IsAuthenticated, EsAdmin))
@transaction.atomic
def subir_documento(request):
    """Sube los documentos .csv a la base de datos.

    Args:
    request: API request.
    """

    args = verify_post_params(request, ['filename', 'content'])
    admin = Administrador.objects.get(usuario=request.user)
    doc = Documento.objects.create(nombre=args['filename'],
                                   contenido_subido=args['content'],
                                   admin=admin, proceso_id=args['proceso'])

    contenido = json.loads(args['content'])

    print(contenido['data'])
    for c in contenido['data']:
        print(c)
        p_ok = get_last_valid_pass(c)
        paso = Paso.objects.filter(proceso_id=args['proceso'],
                                   numero=p_ok if p_ok != -1 else 1).first()

        handle_update_tramite(paso, args, c, p_ok)
        finished_step = Paso.objects.filter(
            proceso_id=args['proceso']).order_by('-numero').first()
        if paso == finished_step:
            send_mail(('Tu trámite #{0} ha sido completado. '
                       'Evalúa los trámites escolares').format(c['ticket']),
                      email_text_for_completed_procedure(c['ticket']),
                      'tramites.escolares@tec.mx',
                      ["{}@itesm.mx".format(c['matricula'])],
                      fail_silently=False)

    return JsonResponse(doc.id, safe=False)


# READ
@api_view(["POST"])
@permission_classes((IsAuthenticated, EsAdmin))
def documentos(request):
    """Regresa el registro de archivos subidos por administradores usuario.

    Args:
    request: API request.
    """
    del request
    docs = Documento.objects.select_related('admin__usuario').values(
        'id', 'nombre', 'fecha', 'contenido_subido',
        email=F('admin__usuario__email'), id_admin=F('admin_id'))
    print(docs)
    docs = [dict(p) for p in docs]
    return JsonResponse(docs, safe=False)


# UPDATE
# DELETE
@api_view(["POST"])
@permission_classes((IsAuthenticated, EsAdmin))
@transaction.atomic
def eliminar_documentos(request):
    """Receives documents in request and deletes them.

    Args:
    request: API request.
    """
    return eliminar_datos(request, Documento, 'documentos')
