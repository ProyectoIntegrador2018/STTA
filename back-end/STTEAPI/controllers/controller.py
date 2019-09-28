# coding=utf-8
from datetime import datetime
import json
import re

from django.core import serializers
from django.core.mail import send_mail

from django.core.exceptions import ObjectDoesNotExist
from django.http import JsonResponse, HttpResponse
from django.db import transaction, IntegrityError
from django.utils.encoding import force_bytes, force_text
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode, urlencode
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes

from STTEAPI.models import *
from django.contrib.auth import authenticate
from rest_framework.permissions import AllowAny
from rest_framework.authtoken.models import Token
from STTEAPI.settings.authentication import IsAuthenticated
from STTEAPI.tools.parameters_list import PostParametersList
from STTEAPI.settings.exceptions import *
from STTEAPI.settings.password_token import PasswordToken
from django.db.models import Count, F
from django.template import loader

# New imports LBRL
from weasyprint import HTML

EMAIL_REGEX = r"^(a|A)[0-9]{8}@(itesm.mx|tec.mx)$"


@api_view(["POST"])
@permission_classes((IsAuthenticated, EsAdmin))
def procesos(request):
    """Cuenta los pasos de un proceso."""
    procs = Proceso.objects.values().annotate(pasos=Count('paso'))
    procs = [dict(p) for p in procs]
    return JsonResponse(procs, safe=False)


@api_view(["GET"])
@permission_classes((IsAuthenticated, EsAdmin))
def return_student(request, id_alumno):
    """Recuperar el alumno en formato json.
    Args:
    request: HTTP request.
    id_alumno: Numero de id de alumno.
    """
    del request
    stu = Alumno.objects.filter(id=id_alumno)
    stu = serializers.serialize('json', stu)
    return HttpResponse(stu, content_type='application/json')


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
    p: dictionanary of values.
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
    model: The mysql model object.
    key_name: Name of the key to usse.
    """
    args = PostParametersList(request)
    args.check_parameter(key=key_name, required=True, is_json=True)
    print(args[key_name])
    for p in args[key_name]:
        try:
            deletion_func(model, p)
        except IntegrityError:
            raise APIExceptions.PermissionDenied

    return JsonResponse(1, safe=False)


@api_view(["POST"])
@permission_classes((IsAuthenticated, EsAdmin))
@transaction.atomic
def borrar_procesos(request):
    """Returns JSON response from deleting documents.

    Args:
    request: API request.
    """
    return eliminar_datos(request, Proceso, 'procesos')


@api_view(["POST"])
@permission_classes((IsAuthenticated, EsAdmin))
@transaction.atomic
def eliminar_documentos(request):
    """Returns JSON response from deleting documents.

    Args:
    request: API request.
    """
    return eliminar_datos(request, Documento, 'documentos')


@api_view(["POST"])
@permission_classes((IsAuthenticated, EsAdmin))
@transaction.atomic
def eliminar_tramites(request):
    """Returns JSON response from deleting tramitealumnos.

    Args:
    request: API request.
    """
    return eliminar_datos(request, Tramitealumno, 'tramites')


@api_view(["POST"])
@permission_classes((IsAuthenticated, EsAdmin))
def eliminar_plantilla_carta(request):
    """Returns JSON response from deleting a letter template.

    Args:
    request: API request.
    """
    return eliminar_datos(request, Carta, 'cartas')


@api_view(["POST"])
@permission_classes((IsAuthenticated, EsAdmin))
@transaction.atomic
def eliminar_alumnos(request):
    """Returns JSON response from deleting students.

    Args:
    request: API request.
    """
    return eliminar_datos(request, Alumno, 'alumno', eliminar_usuarios)


@api_view(["POST"])
@permission_classes((IsAuthenticated, EsAdmin))
@transaction.atomic
def eliminar_administradores(request):
    """Returns JSON response from deleting admins.

    Args:
    request: API request.
    """
    return eliminar_datos(request, Administrador, 'admin', eliminar_usuarios)


@api_view(["POST"])
@permission_classes((IsAuthenticated, EsAdmin))
@transaction.atomic
def eliminar_carta(request):
    """Returns JSON response from deleting a letter.

    Args:
    request: API request.
    """

    def _eliminar_con_alumno_carta(model, p):
        # TODO utilize fecha_creacion.
        docs = model.objects.filter(
            id_alumno=p['id_alumno'],
            id_carta=p['id_carta'])
        docs.delete()

    return eliminar_datos(request, CartaAlumno, 'documentos',
                          _eliminar_con_alumno_carta)


@api_view(["POST"])
@permission_classes((IsAuthenticated, EsAdmin))
@transaction.atomic
def agregar_proceso(request):
    """Registra los procesos nuevos en la base de datos.

    Args:
    request: API request.
    """
    args = PostParametersList(request)
    args.check_parameter(key='nombre', required=True)
    args.check_parameter(key='ticket', required=True, is_json=True)
    args.check_parameter(key='fecha_apertura', required=True, is_json=True)
    args.check_parameter(key='ultima_actualizacion', required=True,
                         is_json=True)
    args.check_parameter(key='matricula', required=True, is_json=True)
    args.check_parameter(key='pasos', required=True, is_json=True)
    print(args['matricula'])

    proc = Proceso.objects.create(
        nombre=args['nombre'], columna_matricula=args['matricula']['key'],
        columna_ticket=args['ticket']['key'],
        columna_fecha_ultima_actualizacion=args['ultima_actualizacion']['key'],
        columna_fecha_inicio=args['fecha_apertura']['key'])

    for p in args['pasos']:
        print(p)
        p = Paso.objects.create(proceso=proc, nombre=p['nombre'],
                                columna_csv=p['columna_csv'],
                                nombre_mostrar=p['nombre_mostrar'],
                                mostrar=p['mostrar'], numero=p['numero'])

    return JsonResponse(1, safe=False)


@api_view(["POST"])
@permission_classes((IsAuthenticated, EsAdmin))
def pasos_procesos(request):
    """Regresa los pasos de un proceso en un archivo diccinario.

    Args:
    request: API request.
    """
    args = PostParametersList(request)
    args.check_parameter(key='proceso', required=True)
    args = args.__dict__()
    pasos = Paso.objects.filter(proceso_id=args['proceso']).values()
    pasos = [dict(p) for p in pasos]
    return JsonResponse(pasos, safe=False)


@api_view(["POST"])
def registro_Alumnos(request):
    """Guarda la información del alumno cuando se va a registrar.

    Args:
    request: API request.
    """
    args = PostParametersList(request)
    args.check_parameter(key='email', required=True)
    args.check_parameter(key='password', required=True)
    args.check_parameter(key='nombre', required=True)
    args.check_parameter(key='apellido', required=True)
    args = args.__dict__()
    if not re.match(EMAIL_REGEX, args['email']):
        raise exceptions.PermissionDenied(detail="Email inválido")
    try:
        user = Usuario.objects.create_alumno(
            email=args['email'],
            password=args['password'],
            nombre=args['nombre'],
            apellido=args['apellido'],
            matricula=args['email'].split('@')[0].upper()
        )
    except IntegrityError as e:
        raise exceptions.PermissionDenied(detail="Email ya registrado")
    return JsonResponse(1, safe=False)

@api_view(["POST"])
@permission_classes((IsAuthenticated, EsAdmin))
def registro_administradores(request):
    """Registra un administrador.

    Args:
    request: API request.
    """
    args = PostParametersList(request)
    args.check_parameter(key='email', required=True)
    args.check_parameter(key='nombre', required=True)
    args = args.__dict__()
    try:
        user = Usuario.objects.create_admin(email=args['email'],
                                            password=12345678,
                                            nombre=args['nombre'])
    except IntegrityError as e:
        raise exceptions.PermissionDenied(detail="Email ya registrado")
    return JsonResponse(1, safe=False)


@api_view(["POST"])
@permission_classes((IsAuthenticated, EsAdmin))
def documentos(request):
    """Regresa el registro de archivos subidos por administradores usuario.

    Args:
    request: API request.
    """
    docs = Documento.objects.select_related('admin__usuario').values(
        'id', 'nombre', 'fecha', 'contenido_subido',
        email=F('admin__usuario__email'), id_admin=F('admin_id'))
    print(docs)
    docs = [dict(p) for p in docs]
    return JsonResponse(docs, safe=False)


@api_view(["POST"])
@permission_classes((IsAuthenticated, EsAdmin))
@transaction.atomic
def subir_documento(request):
    """Sube los documentos .csv a la base de datos.

    Args:
    request: API request.
    """
    def _validate_date(date_name):
        if c[date_name]:
            try:
                return datetime.strptime(c[date_name], '%d/%m/%y')
            except:
                raise exceptions.PermissionDenied(
                    ("El formato de la fecha [ {0} ] es inválido. "
                     "El formato debe ser: D/M/A").format(c[date_name]))
        else:
            return now()

    args = PostParametersList(request)
    args.check_parameter(key='filename', required=True)
    args.check_parameter(key='content', required=True)
    admin = Administrador.objects.get(usuario=request.user)
    doc = Documento.objects.create(nombre=args['filename'],
                                   contenido_subido=args['content'],
                                   admin=admin, proceso_id=args['proceso'])

    contenido = json.loads(args['content'])

    print(contenido['data'])
    for c in contenido['data']:
        print(c)

        fecha_1 = _validate_date('fecha_apertura')
        fecha_2 = _validate_date('fecha_ultima')

        p_ok = 0
        p = 1
        while (('paso_' + str(p)) in c):
            if c['paso_' + str(p)] == 'ok':
                p_ok = p
            p = p + 1

        paso = Paso.objects.filter(proceso_id=args['proceso'],
                                   numero=p_ok if p_ok != -1 else 1).first()

        num_results = Tramitealumno.objects.filter(
            numero_ticket=c['ticket']).count()
        if num_results > 0:
            tra = Tramitealumno.objects.filter(
                numero_ticket=c['ticket']).first()
            tra.fecha_ultima_actualizacion = fecha_2
            tra.paso_actual = paso
            tra.numero_paso_actual = p_ok
            tra.save()
        else:
            tra = Tramitealumno.objects.create(
                matricula=c['matricula'], numero_ticket=c['ticket'],
                proceso_id=args['proceso'], fecha_inicio=fecha_1,
                fecha_ultima_actualizacion=fecha_2, paso_actual=paso,
                numero_paso_actual=p_ok)

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


def email_text_for_completed_procedure(ticket_id):
    return ('Hola,\n\nEste mensaje es para avisarte que tu trámite #{0} '
            'ha sido completado el día de hoy.\n\nPor favor realiza la '
            'siguiente encuesta sobre tu experiencia '
            'https://forms.gle/GzcmC4f9cmFKS2ee9').format(ticket_id)


def handle_login(request, model):
    """Handles generic login for user.

    Args:
    request: API request.
    model: The mysql model object.
    """
    email = request.POST.get('email', '')
    password = request.POST.get('password', '')
    user = authenticate(username=email, password=password)
    if user is None:
        raise exceptions.AuthenticationFailed(detail="Credenciales incorrectas")
    if not user.es_admin:
        raise exceptions.PermissionDenied(detail="Permisos insuficientes")
    token, _ = Token.objects.get_or_create(user=user)
    logged_in_user = model.objects.get(usuario=user)
    user.last_login = now()
    user.save()
    return logged_in_user, user, token

@api_view(["POST"])
def login_admin(request):
    """Corrobora las credenciales en el inicio de sesión del administrador.

    Args:
    request: API request.
    """
    admin, user, token = handle_login(request, Administrador)
    return JsonResponse({'token': token.key, 'nombre': admin.nombre,
                         'email': user.email,
                         'is_superuser': user.is_superuser}, safe=False)


@api_view(["POST"])
def login_student(request):
    """Corrobora las credenciales del inicio de sesión del estudiante.

    Args:
    request: API request.
    """
    al, user, token = handle_login(request, Alumno)
    return JsonResponse({'token': token.key, 'matricula': user.email,
                         'nombre': al.nombre + " " + al.apellido}, safe=False)


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

    args = PostParametersList(request)
    args.check_parameter(key='email', required=True)
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
    args = PostParametersList(request)
    args.check_parameter(key='uid', required=True)
    args.check_parameter(key='token', required=True)
    args.check_parameter(key='password', required=True)

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
    args = PostParametersList(request)
    args.check_parameter(key='uid', required=True)
    args.check_parameter(key='token', required=True)
    user = PasswordToken.validate_token(args['uid'], args['token'])

    if user is None:
        raise APIExceptions.InvalidUIdToken
    else:
        return JsonResponse(1, safe=False)


def return_user_list(user_type):
    users = user_type.objects.select_related('usuario').values(
        'id', 'nombre', 'usuario__id', email=F('usuario__email'),
        last_login=F('usuario__last_login'))
    users = [dict(user) for user in users]
    return JsonResponse(users, safe=False)


@api_view(["GET"])
@permission_classes((IsAuthenticated, EsAdmin))
def return_admin_list(request):
    """Regresa la lista entera de administradores.

    Args:
    request: API request.
    """
    del request
    return return_user_list(Administrador)


@api_view(["GET"])
@permission_classes((IsAuthenticated, EsAdmin))
def return_student_list(request):
    """Regresa la lista entera de alumnos.

    Args:
    request: API request.
    """
    del request
    return return_user_list(Alumno)


@api_view(["GET", "POST"])
# @permission_classes((IsAuthenticated, EsAdmin))
def return_datos_tramite(request):
    """Recupera los datos del tramite y se envían en formato json.

    Args:
    request: API request.
    """
    del request
    tra = Tramitealumno.objects.select_related('proceso').values(
        'id', 'matricula', 'numero_ticket', 'fecha_inicio',
        'numero_paso_actual', 'proceso__nombre', 'fecha_ultima_actualizacion')
    tra = [dict(t) for t in tra]
    return JsonResponse(tra, safe=False)


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


@api_view(["GET"])
# @permission_classes((IsAuthenticated, EsAdmin))
def return_tramite_alumnos(request, matricula):
    """Regresa los tramites de alumnos.

    Los atributos de fecha de inicio, fecha de ultima actualizacion, nombre de
    proceso, paso actual del trámite actual dada una matricula de usuario en
    formato de diccionario.

    Args:
    request: API request.
    matricula: Student ID.
    """
    del request
    query = ("SELECT ta.id, pr.nombre, alumno, paso_actual, "
             "numero_paso_actual, fecha_inicio, "
             "fecha_ultima_actualizacion, numero_ticket, "
             "matricula, encuesta, count(p.id) as pasos, "
             "IF(paso_actual=count(p.id),'TERMINADO', "
             "IF(paso_actual=0,'INICIADO','ENPROCESO')) as status "
             "FROM TramiteAlumno ta join Proceso pr on ta.proceso = pr.id join "
             "Paso p on ta.proceso=p.proceso where matricula = '{0}' "
             "group by numero_ticket;")
    return run_db_query(query.format(matricula))


def return_tramite_transferencia(request):
    """Regresa los tramites de transferencia.

    Los atributos de fecha de inicio, fecha de ultima actualizacion,
    nombre de proceso,paso actual del trámite actual donde el nombre del
    proceso se llame Transferencia en formato de diccionario.

    Args:
    request: API request.
    """
    del request
    query = ("SELECT ta.id, fecha_inicio, fecha_ultima_actualizacion, "
             "numero_ticket, pr.nombre, paso_actual, "
             "IF(paso_actual=count(p.id),'TERMINADO', "
             "IF(paso_actual=0,'INICIADO','ENPROCESO')) as status "
             "FROM TramiteAlumno ta join Proceso pr on ta.proceso = pr.id join "
             "Paso p on ta.proceso=p.proceso WHERE pr.nombre='Transferencia' "
             "group by numero_ticket;")
    return run_db_query(query)


def return_tramite_transferencia_pasos(request):
    """Regresa los pasos de tramites de transferencia.

    Los nombres de los pasos y proceso donde el nombre del
    proceso se llame Transferencia en formato de diccionario

    Args:
    request: API request.
    """
    del request
    query = ('SELECT pr.nombre, p.nombre '
             'FROM Paso p join Proceso pr on p.proceso=pr.id '
             'WHERE pr.nombre="Transferencia";')
    return run_db_query(query)


def get_tramites_resumen(request, proceso, month, status):
    """Regresa todas las columnas de ResumenTramites en formato de diccionario.

    Args:
    request: API request.
    proceso: Process #.
    month: Month #.
    status: Status #.
    """
    del request
    query = ('SELECT * FROM STTE.ResumenTramites '
             'WHERE proceso = {0};').format(proceso)
    where = ''
    if month != "0":
        where += ' and month = {0}'.format(month)
    if status != "-1":
        where += ' and status = {0}'.format(status)
    return run_db_query(query + where + ';')


def get_pasos_proceso(request, proceso):
    """Regresa todos los atributos de Paso en formato de diccionario.

    Args:
    request: API request.
    """
    del request
    query = 'SELECT * FROM STTE.Paso WHERE proceso = {0};'
    return run_db_query(query.format(proceso))


def return_procesos(request):
    """Regresa todos los atributos de Proceso en formato de diccionario.

    Args:
    request: API request.
    """
    del request
    query = 'SELECT * FROM Proceso pr'
    return run_db_query(query)


def return_procesos_pasos(request, proceso):
    """Regresa nombre de proceso y de paso en formato de diccionario.

    Args:
    request: API request.
    """
    del request
    query = ("SELECT pr.nombre, p.nombre "
             "FROM Paso p join Proceso pr "
             "on p.proceso = pr.id "
             "WHERE pr.nombre = '{0}';").format(proceso)
    return run_db_query(query)


def return_tramite(request, proceso):
    """Regresa tramites en formato de diccionario.

    Args:
    request: API request.
    """
    del request
    query = ("SELECT ta.id, fecha_inicio, fecha_ultima_actualizacion, "
             "numero_ticket, pr.nombre, paso_actual, "
             "IF(paso_actual=count(p.id),'TERMINADO', "
             "IF(paso_actual=0,'INICIADO','ENPROCESO')) as status "
             "FROM TramiteAlumno ta join Proceso pr "
             "on ta.proceso = pr.id join "
             "Paso p on ta.proceso=p.proceso "
             "WHERE pr.nombre= '{0}' group by numero_ticket;")
    return run_db_query(query.format(proceso))


@api_view(["GET"])
# @permission_classes((IsAuthenticated, EsAdmin))
def return_tramite_alumnos_status(request):
    """Regresa todos los atributos del trámite actual del alumno.

    Args:
    request: API request.
    """
    del request
    query = ("SELECT ta.id, pr.nombre, alumno, paso_actual, "
             "fecha_inicio, fecha_ultima_actualizacion, "
             "numero_ticket, matricula, encuesta, count(p.id) as pasos, "
             "IF(paso_actual=count(p.id),'TERMINADO', "
             "IF(paso_actual=0,'INICIADO','ENPROCESO')) as status "
             "FROM TramiteAlumno ta join Proceso pr "
             "on ta.proceso = pr.id join "
             "Paso p on ta.proceso=p.proceso "
             "where year(now()) = year(fecha_ultima_actualizacion) "
             "and month(now()) = month(fecha_ultima_actualizacion) "
             "group by numero_ticket;")
    return run_db_query(query)


@api_view(["GET"])
# @permission_classes((IsAuthenticated, EsAdmin))
def return_tramite_alumnos_status_week(request):
    """Regresa todos los atributos de tramite actual por semana.

    Args:
    request: API request.
    """
    del request
    query = ("SELECT ta.id, pr.nombre, alumno, paso_actual, "
             "fecha_inicio, fecha_ultima_actualizacion, "
             "numero_ticket, matricula, encuesta, count(p.id) as pasos, "
             "IF(paso_actual=count(p.id),'TERMINADO', "
             "IF(paso_actual=0,'INICIADO','ENPROCESO')) as status "
             "FROM TramiteAlumno ta join Proceso pr on ta.proceso = pr.id join "
             "Paso p on ta.proceso=p.proceso where "
             "week(now()) - 1 = week(fecha_ultima_actualizacion) "
             "group by numero_ticket;")
    return run_db_query(query)


@api_view(["GET"])
@permission_classes((IsAuthenticated, EsAlumno | EsAdmin))
def get_datos_tramite_alumno(request, id):
    """Regresa datos sobre el proceso del trámite actual.

    Args:
    request: API request.
    """
    del request
    tra = Tramitealumno.objects.select_related('proceso').values(
        'id', 'matricula', 'numero_ticket', 'proceso__nombre', 'proceso_id',
        'fecha_inicio', 'paso_actual', 'numero_paso_actual',
        'fecha_ultima_actualizacion').filter(id=id)
    tra = [dict(t) for t in tra]
    return JsonResponse(tra, safe=False)


@api_view(["POST"])
@permission_classes((IsAuthenticated, EsAlumno | EsAdmin))
def get_pasos_tramites(request):
    """Regresa los pasos del trámite dada la llave id en formato de diccionario.

    Args:
    request: API request.
    """
    args = PostParametersList(request)
    args.check_parameter(key='id', required=True)
    args = args.__dict__()
    tra = Paso.objects.filter(proceso_id=args['id']).order_by('numero').values()
    tra = [dict(t) for t in tra]
    return JsonResponse(tra, safe=False)


# New API functions LBRL

# Database handler - Alumnos
@api_view(["POST"])
def upload_students(request):
    """Creates or updates a student.

    Args:
    request: API request.
    """
    args = PostParametersList(request)
    args.check_parameter(key='content', required=True)
    contenido = json.loads(args['content'])

    print(contenido['data'])

    alumnosJson = contenido['data']

    for alumno in alumnosJson:
        # Dando de alta información en la tabla de alumnos
        counter = Alumno.objects.filter(matricula=alumno['Matricula']).count()
        if counter == 0:
            # Crear nuevo usuario en la base de datos
            usuario = Usuario.objects.create(email=alumno['Email'],
                                             password=alumno['Contraseña'],
                                             is_staff=True, is_superuser=True,
                                             es_alumno=True)
            # Crear nuevo alumno en la base de datos
            Alumno.objects.create(
                nombre=alumno['Nombre'], usuario=usuario,
                matricula=alumno['Matricula'],
                siglas_carrera=alumno['Siglas Carrera'],
                carrera=alumno['Carrera'],
                semestre_en_progreso=alumno['Semestre en Progreso'],
                periodo_de_aceptacion=alumno['Periodo de Aceptacion'],
                posible_graduacion=alumno['Posible Graduacion'],
                fecha_de_nacimiento=alumno['Fecha de Nacimiento'],
                nacionalidad=alumno['Nacionalidad'])
        else:
            # Actualizar alumno existente
            alumno_db = Alumno.objects.filter(
                matricula=alumno['Matricula']).first()
            alumno_db.nombre = alumno['Nombre']
            alumno_db.siglas_carrera = alumno['Siglas Carrera']
            alumno_db.carrera = alumno['Carrera']
            alumno_db.semestre_en_progreso = alumno['Semestre en Progreso']
            alumno_db.periodo_de_aceptacion = alumno['Periodo de Aceptacion']
            alumno_db.posible_graduacion = alumno['Posible Graduacion']
            alumno_db.fecha_de_nacimiento = alumno['Fecha de Nacimiento']
            alumno_db.nacionalidad = alumno['Nacionalidad']
            alumno_db.save()

    return JsonResponse({'message': 'File uploaded successfully'})


# Letters

# Helper funcitons
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
    # templateFolder = '../templates/'
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
    args = PostParametersList(request)
    args.check_parameter(key='id_admin', required=True)
    args.check_parameter(key='descripcion', required=True)

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
                         fecha_modificacion=ts, modificado_por=args['id_admin'])

    return JsonResponse({'message': 'File uploaded successfully'})


# Get letter
@api_view(["GET"])
@permission_classes((IsAuthenticated, EsAlumno | EsAdmin))
def get_letters(request):
    """Get all letters created by administrator.

    Args:
    request: API request.
    """
    del request
    query = ("SELECT a.id, a.nombre as nombre_carta, "
             "a.descripcion, a.fecha_creacion, b.nombre "
             "FROM Carta a INNER JOIN Administrador b "
             "on a.creado_por = b.id")
    return run_db_query(query)


# Get letter
@api_view(["GET"])
@permission_classes((IsAuthenticated, EsAlumno | EsAdmin))
def get_students(request):
    """Get all students.

    Args:
    request: API request.
    """
    del request
    tra = list(Alumno.objects.all().values('id', 'matricula'))
    return JsonResponse(tra, safe=False)


@api_view(["GET"])
@permission_classes((IsAuthenticated, EsAlumno | EsAdmin))
def get_students_letters(request):
    """Get all student letters.

    Args:
    request: API request.
    """
    del request
    # TODO once mysql use foreign keys & django api instead of this ugliness...
    query = ('SELECT b.id_alumno, b.id_carta, a.matricula, '
             'a.nombre as nombre_alumno, c.nombre as nombre_carta, '
             'b.fecha_creacion FROM Alumno a INNER JOIN '
             'CartaAlumno b on a.id = b.id_alumno INNER JOIN '
             'Carta c on c.id = b.id_carta')
    return run_db_query(query)


@api_view(["GET"])
# @permission_classes((IsAuthenticated, EsAlumno | EsAdmin))
def get_student_letter(request, id_alumno, id_carta):
    """Get a student letter.

    Args:
    request: API request.
    id_alumno: Student ID.
    id_carta: Letter ID.
    """
    del request
    # Get letter by id_carta
    carta = Carta.objects.filter(id=id_carta)

    # Get student by id_student
    alumno = Alumno.objects.filter(id=id_alumno)

    # Calculated data
    today = datetime.today()
    # dd/mm/YY
    current_date = today.strftime("%d/%m/%Y")

    # Send parameters student data to letter
    html = loader.render_to_string(carta[0].nombre,
                                   dict(nombre=alumno[0].nombre,
                                        matricula=alumno[0].matricula,
                                        siglas_carrera=alumno[0].siglas_carrera,
                                        carrera=alumno[0].carrera,
                                        semestre_en_progreso=alumno[
                                            0].semestre_en_progreso,
                                        periodo_de_aceptacion=alumno[
                                            0].periodo_de_aceptacion,
                                        posible_graduacion=alumno[
                                            0].posible_graduacion,
                                        fecha_de_nacimiento=alumno[
                                            0].fecha_de_nacimiento,
                                        nacionalidad=alumno[0].nacionalidad,
                                        fecha_actual=current_date))

    # Create carta alumno
    ts = datetime.now().timestamp()

    CartaAlumno.objects.create(id_carta=id_carta,
                               id_alumno=id_alumno,
                               fecha_creacion=ts,
                               fecha_modificacion=ts,
                               creado_por=id_alumno,
                               modificado_por=id_alumno)

    # Create response
    pdf_file = HTML(string=html).write_pdf()
    response = HttpResponse(pdf_file, content_type="application/pdf")
    # Response: inline to open pdf reader on browser | attachment to download .
    response['Content-Disposition'] = 'filename=output.pdf'

    return response
