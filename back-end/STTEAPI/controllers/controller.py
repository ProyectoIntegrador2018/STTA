# coding=utf-8
from datetime import datetime
import json
import re

from django.core import serializers

from django.core.exceptions import ObjectDoesNotExist
from django.http import JsonResponse, HttpResponse
from django.db import transaction,IntegrityError
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
from django.core.mail import send_mail
from django.template import loader

EMAIL_REGEX = r"^(a|A)[0-9]{8}@(itesm.mx|tec.mx)$"

#                                                           #Entrada: Nada ; Salida: Un archivo diccinario
#                                                           #Cuenta los pasos de un proceso
@api_view(["POST"])
@permission_classes((IsAuthenticated, EsAdmin))
def procesos(request):
    procs = Proceso.objects.values().annotate(pasos=Count('paso'))
    procs = [dict(p) for p in procs]
    return JsonResponse(procs, safe=False)

#                                                           #Entrada: Nada ; Salida: Nada
#                                                           #Borra procesos del sistema
@api_view(["POST"])
@permission_classes((IsAuthenticated, EsAdmin))
@transaction.atomic
def borrar_procesos(request):
    args = PostParametersList(request)
    args.check_parameter(key='procesos', required=True, is_json=True)

    print(args['procesos'])

    for p in args['procesos']:
        try:
            proc = Proceso.objects.get(id=p['id'])
            proc.delete()
        except IntegrityError:
            raise exceptions.PermissionDenied(
                detail="El proceso ("+str(p['id'])+") no se puede eliminar porque hay documentos o trámites ligados a él.")

    return JsonResponse(1, safe=False)

#                                                           #Entrada: Nada ; Salida: Nada
#                                                           #Borra un documento dado un id pasado en request
@api_view(["POST"])
@permission_classes((IsAuthenticated, EsAdmin))
@transaction.atomic
def eliminar_documentos(request):
    args = PostParametersList(request)
    args.check_parameter(key='documentos', required=True, is_json=True)
    print(args['documentos'])
    for p in args['documentos']:
        try:
            doc = Documento.objects.get(id=p['id'])
            doc.delete()
        except IntegrityError:
            raise APIExceptions.PermissionDenied

    return JsonResponse(1, safe=False)

#                                                           #Entrada: Nada ; Salida: Nada
#                                                           #Registra los procesos nuevos en la base de datos
@api_view(["POST"])
@permission_classes((IsAuthenticated, EsAdmin))
@transaction.atomic
def agregar_proceso(request):
    args = PostParametersList(request)
    args.check_parameter(key='nombre', required=True)
    args.check_parameter(key='ticket', required=True, is_json=True)
    args.check_parameter(key='fecha_apertura', required=True, is_json=True)
    args.check_parameter(key='ultima_actualizacion', required=True, is_json=True)
    args.check_parameter(key='matricula', required=True, is_json=True)
    args.check_parameter(key='pasos', required=True, is_json=True)
    print(args['matricula'])

    proc = Proceso.objects.create(nombre=args['nombre'],
                           columna_matricula=args['matricula']['key'],
                           columna_ticket=args['ticket']['key'],
                           columna_fecha_ultima_actualizacion=args['ultima_actualizacion']['key'],
                           columna_fecha_inicio=args['fecha_apertura']['key'])

    for p in args['pasos']:
        print(p)
        p = Paso.objects.create(proceso=proc, nombre=p['nombre'], columna_csv=p['columna_csv'],
                                nombre_mostrar=p['nombre_mostrar'], mostrar=p['mostrar'], numero=p['numero'])

    return JsonResponse(1, safe=False)

#                                                           #Entrada: Nada ; Salida: Un archivo diccinario
#                                                           #Regresa los pasos de un proceso
@api_view(["POST"])
@permission_classes((IsAuthenticated, EsAdmin))
def pasos_procesos(request):
    args = PostParametersList(request)
    args.check_parameter(key='proceso', required=True)
    args = args.__dict__()
    pasos = Paso.objects.filter(proceso_id=args['proceso']).values()
    pasos = [dict(p) for p in pasos]
    return JsonResponse(pasos, safe=False)

#                                                           # Entrada: email, password, nombre, apellido; Salida: none.
#                                                           # Metodo para guardar en la base de datos la información del
#                                                           # alumno cuando se va a registrar.
@api_view(["POST"])
def registro_Alumnos(request):
    args = PostParametersList(request)
    args.check_parameter(key='email', required=True)
    args.check_parameter(key='password', required=True)
    args.check_parameter(key='nombre', required=True)
    args.check_parameter(key='apellido', required=True)
    args = args.__dict__()
    if not re.match(EMAIL_REGEX, args['email']):
        raise exceptions.PermissionDenied(detail="Email inválido")
    try:
        user = Usuario.objects.create_alumno(email=args['email'], password=args['password'], nombre=args['nombre'], apellido=args['apellido'])
    except IntegrityError as e:
        raise exceptions.PermissionDenied(detail="Email ya registrado")
    return JsonResponse(1, safe=False)

#                                                           #Entrada: Nada ; Salida: Un archivo diccinario
#                                                           #Regresa el registro de archivos subidos por administradores usuario
@api_view(["POST"])
@permission_classes((IsAuthenticated, EsAdmin))
def documentos(request):
    docs = Documento.objects.select_related('admin__usuario').values('id','nombre', 'fecha', 'contenido_subido',
                                                                     email=F('admin__usuario__email'),
                                                                     id_admin=F('admin_id'))

    print(docs)
    docs = [dict(p) for p in docs]
    return JsonResponse(docs, safe=False)

#                                                           #Entrada: Nada ; Salida: Nada
#                                                           #Sube los documentos .csv a la base de datos
@api_view(["POST"])
@permission_classes((IsAuthenticated, EsAdmin))
@transaction.atomic
def subir_documento(request):
    args = PostParametersList(request)
    args.check_parameter(key='filename', required=True)
    args.check_parameter(key='content', required=True)
    admin = Administrador.objects.get(usuario=request.user)
    doc = Documento.objects.create(nombre=args['filename'],contenido_subido=args['content'],admin=admin,
                                   proceso_id=args['proceso'])

    contenido = json.loads(args['content'])

    print(contenido['data'])
    for c in contenido['data']:
        fecha_1 = now()
        fecha_2 = now()
        if  c['fecha_apertura'] != None and c['fecha_apertura'] != "":
            try:
                fecha_1 = datetime.strptime(c['fecha_apertura'], '%d/%m/%y')
            except:
                raise exceptions.PermissionDenied("El formato de la fecha [ "+c['fecha_ultima']+" ] es inválido. El formato debe ser: D/M/A")
        if c['fecha_ultima'] != None and c['fecha_ultima'] != "":
            try:
                fecha_2 = datetime.strptime(c['fecha_ultima'], '%d/%m/%y')
            except:
                raise exceptions.PermissionDenied("El formato de la fecha [ "+c['fecha_ultima']+" ] es inválido. El formato debe ser: D/M/A")
        p_ok = 0
        p = 1
        while (('paso_' + str(p)) in c ):
            if c['paso_' + str(p)] == 'ok':
                p_ok = p
            p = p + 1
        paso = None
        if p_ok != -1:
            paso = Paso.objects.filter(proceso_id=args['proceso'], numero=p_ok).first()
        else:
            paso = Paso.objects.filter(proceso_id=args['proceso'], numero=1).first()

        num_results = Tramitealumno.objects.filter(numero_ticket=c['ticket']).count()
        if num_results > 0:
            tra = Tramitealumno.objects.filter(numero_ticket=c['ticket']).first()
            tra.fecha_ultima_actualizacion = fecha_2
            tra.paso_actual = paso
            tra.numero_paso_actual = p_ok
            tra.save()
        else:
            tra = Tramitealumno.objects.create(matricula=c['matricula'], numero_ticket=c['ticket'],proceso_id=args['proceso'],
                                           fecha_inicio=fecha_1, fecha_ultima_actualizacion=fecha_2, paso_actual=paso,
                                               numero_paso_actual=p_ok)

    return JsonResponse(doc.id, safe=False)

#                                                           #Entrada: Nada ; Salida: Nada
#                                                           #Corrobora las credenciales en el inicio de sesión del administrador
@api_view(["POST"])
def login_admin(request):
    email = request.POST.get('email','')
    password = request.POST.get('password','')
    user = authenticate(username=email, password=password)
    if user == None:
        raise exceptions.AuthenticationFailed(detail="Credenciales incorrectas")
    if not user.es_admin:
        raise exceptions.PermissionDenied(detail="Permisos insuficientes")
    token, _ = Token.objects.get_or_create(user=user)
    al = Administrador.objects.get(usuario=user)
    user.last_login = now()
    user.save()
    return JsonResponse({'token': token.key, 'nombre': al.nombre, 'email': user.email }, safe=False)

#                                                           #Entrada: Nada ; Salida: Nada
#                                                           #Corrobora las credenciales del inicio de sesión del estudiante
@api_view(["POST"])
def login_student(request):
    email = request.POST.get('email','')
    password = request.POST.get('password','')
    user = authenticate(username=email, password=password)
    if user == None:
        raise exceptions.AuthenticationFailed(detail="Credenciales incorrectas")
    if not user.es_alumno:
        raise exceptions.PermissionDenied(detail="Permisos insuficientes")
    token, _ = Token.objects.get_or_create(user=user)
    al = Alumno.objects.get(usuario=user)
    user.last_login = now()
    user.save()
    return JsonResponse({'token': token.key, 'matricula':user.email, 'nombre':al.nombre + " " +al.apellido}, safe=False)

#                                                           #Entrada: Nada ; Salida: Nada
#                                                           #Cierra la sesión del usuario actual
@api_view(["POST"])
@permission_classes((IsAuthenticated, ))
def logout(request):
    request.user.auth_token.delete()
    return JsonResponse("SESION CERRADA de " + request.user.email, safe=False)

#                                                           #Entrada: Nada ; Salida: Nada
#                                                           #Envía la respuesta html para restablecer la contrseña
@api_view(["POST"])
def request_restore(request):
    args = PostParametersList(request)
    args.check_parameter(key='email', required=True)
    url_data = PasswordToken.request_uid_token(args['email'])

    try:

        html_message = loader.render_to_string(
                '../templates/mailTemplate.html',
                {
                    'user_name': "",
                    'subject':  'Restablecer contraseña',
                    'token': url_data.uid + "/"+url_data.token
                }
            )
        send_mail('Restablece tu contraseña', 'STTE ITESM', "", [args['email']],html_message=html_message,fail_silently=False)
    except:
        raise APIExceptions.SendMailError

    return JsonResponse(1, safe=False)

#                                                           #Entrada: Nada ; Salida: check
#                                                           #Procedimiento almacenado que se encarga de verificar que el reseteo
#                                                           # de la contraseña sea válido, si es así entonces manda un check, si no manda una excepción
@api_view(["POST"])
def reset_password(request):
    args = PostParametersList(request)
    args.check_parameter(key='uid', required=True)
    args.check_parameter(key='token', required=True)
    args.check_parameter(key='password', required=True)

    check = PasswordToken.reset_password(args['uid'], args['token'],args['password'])

    if check:
        check.is_active = True
        check.save()
        return JsonResponse(1 if check and check.es_admin else 2, safe=False)
    else:
        raise APIExceptions.InvalidToken.set(detail="Reseteo de contraseña inválido")

#                                                           #Entrada: Nada ; Salida: Nada
#                                                           #Valida que los tokens de contraseña proporcionados sean válidos
@api_view(["POST"])
def validate_password_token(request):
    args = PostParametersList(request)
    args.check_parameter(key='uid', required=True)
    args.check_parameter(key='token', required=True)
    user = PasswordToken.validate_token(args['uid'], args['token'])

    if user is None:
        raise APIExceptions.InvalidUIdToken
    else:
        return JsonResponse(1, safe=False)

#                                                           # Entrada: nada; Salida: una lista con todos los admins con
#                                                           # su informacion de usuario
#                                                           # Regresa la lista entera de administradores
@api_view(["GET"])
@permission_classes((IsAuthenticated, EsAdmin))
def return_admin_list(request):
    admins = Administrador.objects.select_related('usuario').values('id','nombre','usuario__id', email=F('usuario__email'), last_login=F('usuario__last_login'))
    admins = [dict(adm) for adm in admins]
    return JsonResponse(admins, safe=False)


#                                                           # Entrada: nada; Salida: lista con toda la informacion de
#                                                           # usuario de de los alumnos
#                                                           # Se recuperan los datos de todos los alumnos y se envían en
#                                                           # formato json
@api_view(["GET"])
@permission_classes((IsAuthenticated, EsAdmin))
def return_student_list(request):
    stu = Alumno.objects.select_related('usuario').values('id','nombre','apellido','usuario__id', email=F('usuario__email'), last_login=F('usuario__last_login'))
    stu = [dict(adm) for adm in stu]
    return JsonResponse(stu, safe=False)

#                                                           # Entrada: numero de id de alumno ; Salida: todos sus datos
#                                                           # Se usa filter para recuperar el alumno, entonces se
#                                                           # serializa el contenido y se regresa en formato json, se
#                                                           # envía mediante HTTPResponse
@api_view(["GET"])
@permission_classes((IsAuthenticated, EsAdmin))
def return_student(request,id_alumno):
    stu = Alumno.objects.filter(id=id_alumno)
    stu = serializers.serialize('json',stu)
    return HttpResponse(stu, content_type='application/json')

#                                                           #Entrada: Nada ; Salida: Nada
#                                                           #Borra de 1 a N alumnos
@api_view(["POST"])
@permission_classes((IsAuthenticated, EsAdmin))
@transaction.atomic
def eliminar_alumnos(request):
    args = PostParametersList(request)
    args.check_parameter(key='alumno', required=True, is_json=True)
    print(args['alumno'])
    for a in args['alumno']:
        try:
            doc = Alumno.objects.get(id=a['id'])
            user = Usuario.objects.get(id=doc.usuario_id)
            user.delete()
            doc.delete()
        except IntegrityError:
            raise exceptions.PermissionDenied(detail="No se pudo eliminar el alumno")

    return JsonResponse(1, safe=False)

#                                                           #Entrada: Nada ; Salida: Nada
#                                                           #Borra de 1 a N administradores
@api_view(["POST"])
@permission_classes((IsAuthenticated, EsAdmin))
@transaction.atomic
def eliminar_administradores(request):
    args = PostParametersList(request)
    args.check_parameter(key='admin', required=True, is_json=True)
    print(args['admin'])
    for a in args['admin']:
        try:
            doc = Administrador.objects.get(id=a['id'])
            user = Usuario.objects.get(id=doc.usuario_id)
            user.delete()
            doc.delete()
        except IntegrityError:
            raise exceptions.PermissionDenied(detail="No se puede eliminar el usuario. Puede ser que el usuario tengo documentos registrados.")

    return JsonResponse(1, safe=False)

#                                                           #Entrada: Parametro de lista POST ; Salida: Nada
#                                                           #Registra un administrador
@api_view(["POST"])
@permission_classes((IsAuthenticated, EsAdmin))
@transaction.atomic
def eliminar_tramites(request):
    args = PostParametersList(request)
    args.check_parameter(key='tramites', required=True, is_json=True)
    print(args['tramites'])
    for a in args['tramites']:
        try:
            doc = Tramitealumno.objects.get(id=a['id'])
            doc.delete()
        except IntegrityError:
            raise APIExceptions.PermissionDenied

    return JsonResponse(1, safe=False)

#                                                           #Entrada: Parametro de lista POST ; Salida: Nada
#                                                           #Registra un administrador
@api_view(["POST"])
@permission_classes((IsAuthenticated, EsAdmin))
def registro_administradores(request):
    args = PostParametersList(request)
    args.check_parameter(key='email', required=True)
    args.check_parameter(key='nombre', required=True)
    args = args.__dict__()
    try:
        user = Usuario.objects.create_admin(email=args['email'], password=12345678, nombre=args['nombre'])
    except IntegrityError as e:
        raise exceptions.PermissionDenied(detail="Email ya registrado")
    return JsonResponse(1, safe=False)

#                                                           # Entrada: nada; Salida: lista con toda la informacion de
#                                                           # tramites de alumnos
#                                                           # Se recuperan los datos del tramite y se envían en formato
#                                                           # json
@api_view(["GET", "POST"])
#@permission_classes((IsAuthenticated, EsAdmin))
def return_datos_tramite(request):
    tra = Tramitealumno.objects.select_related('proceso').values('id','matricula', 'numero_ticket', 'fecha_inicio', 'numero_paso_actual','proceso__nombre',
                                                                                          'fecha_ultima_actualizacion')
    tra = [dict(t) for t in tra]
    return JsonResponse(tra, safe=False)

#                                                          # Entrada: cursos; Salida: Los atributos pasados en la entrada
#                                                          # en formato de diccionario
def dictfetchall(cursor):
    desc = cursor.description
    return [dict(zip([col[0] for col in desc], row))
              for row in cursor.fetchall()]

#                                                          # Entrada: matricula; Salida: Los atributos de fecha de inicio, fecha de ultima actualizacion, nombre de proceso, paso actual del trámite actual dada una matricula de usuario
#                                                          # en formato de diccionario
@api_view(["GET"])
#@permission_classes((IsAuthenticated, EsAdmin))
def return_tramite_alumnos(request,matricula):
    from django.db import connection
    cursor = connection.cursor()
    cursor.execute('SELECT ta.id, pr.nombre, alumno, paso_actual,numero_paso_actual, fecha_inicio, fecha_ultima_actualizacion, numero_ticket, ' +
                   "matricula, encuesta, count(p.id) as pasos, IF(paso_actual=count(p.id),'TERMINADO',IF(paso_actual=0,'INICIADO','ENPROCESO')) as status " +
                   'FROM TramiteAlumno ta join Proceso pr on ta.proceso = pr.id join'+
                   ' Paso p on ta.proceso=p.proceso ' +
                   'where matricula =' + "'" + matricula + "'" +
                   ' group by numero_ticket')
    tra = dictfetchall(cursor)
    return JsonResponse(tra, safe=False)

#                                                          # Entrada: nada; Salida: Los atributos de fecha de inicio, fecha de ultima actualizacion, nombre de proceso, paso actual del trámite actual donde el nombre del proceso se llame Transferencia
#                                                          # en formato de diccionario
def return_tramite_transferencia(request):
    from django.db import connection
    cursor = connection.cursor()
    cursor.execute('SELECT ta.id, fecha_inicio, fecha_ultima_actualizacion, numero_ticket, ' +
                   "pr.nombre, paso_actual, IF(paso_actual=count(p.id),'TERMINADO',IF(paso_actual=0,'INICIADO','ENPROCESO')) as status " +
                   'FROM TramiteAlumno ta join Proceso pr on ta.proceso = pr.id join'+
                   ' Paso p on ta.proceso=p.proceso' +
                   ' WHERE pr.nombre="Transferencia" ' +
                   ' group by numero_ticket')
    tra = dictfetchall(cursor)
    return JsonResponse(tra, safe=False)

#                                                          # Entrada: nada; Salida: Los nombres de los pasos y proceso donde el nombre del proceso se llame Transferencia
#                                                          # en formato de diccionario
def return_tramite_transferencia_pasos(request):
    from django.db import connection
    cursor = connection.cursor()
    cursor.execute('SELECT pr.nombre, p.nombre ' +
                   'FROM Paso p join Proceso pr on p.proceso=pr.id' +
                   ' WHERE pr.nombre="Transferencia" ')
    tra = dictfetchall(cursor)
    return JsonResponse(tra, safe=False)

#                                                          # Entrada: month y status; Salida: Todas las columnas de ResumenTramites
#                                                          # en formato de diccionario
def get_tramites_resumen(request, proceso, month, status):
    from django.db import connection
    cursor = connection.cursor()
    if month == "0":
        cursor.execute('SELECT * FROM STTE.ResumenTramites '
                       'where proceso = {0} and status = {1};'.format(proceso, status))
        if status == "-1":
            cursor.execute('SELECT * FROM STTE.ResumenTramites '
                           'where proceso = {0};'.format(proceso))
    else:
        cursor.execute('SELECT * FROM STTE.ResumenTramites '
                       'where proceso = {0} and status = {1} and month = {2};'.format(proceso, status, month))
        if status == "-1":
            cursor.execute('SELECT * FROM STTE.ResumenTramites '
                           'where proceso = {0} and month = {1};'.format(proceso, month))
    tra = dictfetchall(cursor)
    return JsonResponse(tra, safe=False)

#                                                          # Entrada: proceso; Salida: Todos los atributos de Paso
#                                                          # en formato de diccionario
def get_pasos_proceso(request, proceso):
    from django.db import connection
    cursor = connection.cursor()
    cursor.execute('SELECT * FROM STTE.Paso '
                   'where proceso = {0}'.format(proceso))
    tra = dictfetchall(cursor)
    return JsonResponse(tra, safe=False)

#                                                          # Entrada: nada; Salida: Todos los atributos de Proceso
#                                                          # en formato de diccionario
def return_procesos(request):
    from django.db import connection
    cursor = connection.cursor()
    cursor.execute('SELECT * ' +
                   'FROM Proceso pr')
    tra = dictfetchall(cursor)
    return JsonResponse(tra, safe=False)

#                                                          # Entrada: proceso; Salida: Los atributos de nombre de proceso y nombre de paso de Paso
#                                                          # en formato de diccionario
def return_procesos_pasos(request, proceso):
    from django.db import connection
    cursor = connection.cursor()
    cursor.execute('SELECT pr.nombre, p.nombre ' +
                   'FROM Paso p join Proceso pr on p.proceso=pr.id' +
                   ' WHERE pr.nombre=' + "'" + proceso + "'")
    tra = dictfetchall(cursor)
    return JsonResponse(tra, safe=False)

#                                                          # Entrada: proceso; Salida: Los atributos de fecha de inicio, fecha de ultima actualizacion, nombre de proceso, paso actual del proceso actual
#                                                          # en formato de diccionario
def return_tramite(request, proceso):
    from django.db import connection
    cursor = connection.cursor()
    cursor.execute('SELECT ta.id, fecha_inicio, fecha_ultima_actualizacion, numero_ticket, ' +
                   "pr.nombre, paso_actual, IF(paso_actual=count(p.id),'TERMINADO',IF(paso_actual=0,'INICIADO','ENPROCESO')) as status " +
                   'FROM TramiteAlumno ta join Proceso pr on ta.proceso = pr.id join'+
                   ' Paso p on ta.proceso=p.proceso' +
                   ' WHERE pr.nombre=' + "'" + proceso + "'" +
                   ' group by numero_ticket')
    tra = dictfetchall(cursor)
    return JsonResponse(tra, safe=False)

#                                                          # Entrada: nada; Salida: Todos los atributos del trámite actual del alumno que invoca la función
#                                                          # en formato de diccionario
@api_view(["GET"])
#@permission_classes((IsAuthenticated, EsAdmin))
def return_tramite_alumnos_status(request):
    from django.db import connection
    cursor = connection.cursor()
    cursor.execute('SELECT ta.id, pr.nombre, alumno, paso_actual, fecha_inicio, fecha_ultima_actualizacion, numero_ticket, ' +
                   "matricula, encuesta, count(p.id) as pasos, IF(paso_actual=count(p.id),'TERMINADO',IF(paso_actual=0,'INICIADO','ENPROCESO')) as status " +
                   'FROM TramiteAlumno ta join Proceso pr on ta.proceso = pr.id join'+
                   ' Paso p on ta.proceso=p.proceso ' +
                   'where year(now()) = year(fecha_ultima_actualizacion) and  month(now()) = month(fecha_ultima_actualizacion) ' +
                   ' group by numero_ticket')
    tra = dictfetchall(cursor)
    return JsonResponse(tra, safe=False)

#                                                          # Entrada: nada; Salida: Todos los atributos de tramite actual por semana del alumno que la invoca
#                                                          # en formato de diccionario
@api_view(["GET"])
#@permission_classes((IsAuthenticated, EsAdmin))
def return_tramite_alumnos_status_week(request):
    from django.db import connection
    cursor = connection.cursor()
    cursor.execute('SELECT ta.id, pr.nombre, alumno, paso_actual, fecha_inicio, fecha_ultima_actualizacion, numero_ticket, ' +
                   "matricula, encuesta, count(p.id) as pasos, IF(paso_actual=count(p.id),'TERMINADO',IF(paso_actual=0,'INICIADO','ENPROCESO')) as status " +
                   'FROM TramiteAlumno ta join Proceso pr on ta.proceso = pr.id join'+
                   ' Paso p on ta.proceso=p.proceso ' +
                   ' where week(now()) - 1 = week(fecha_ultima_actualizacion) ' +
                   ' group by numero_ticket')
    tra = dictfetchall(cursor)
    return JsonResponse(tra, safe=False)

#                                                          # Entrada: id; Salida: Datos sobre el proceso del trámite actual del alumno que invoca la función
#                                                          # en formato de diccionario
@api_view(["GET"])
@permission_classes((IsAuthenticated, EsAlumno | EsAdmin))
def get_datos_tramite_alumno(request,id):

    tra = Tramitealumno.objects.select_related('proceso').values('id','matricula', 'numero_ticket',
                                                                 'proceso__nombre', 'proceso_id',
                                                                 'fecha_inicio', 'paso_actual', 'numero_paso_actual',
                                                                 'fecha_ultima_actualizacion').filter(
                                                                 id=id)
    tra = [dict(t) for t in tra]
    return JsonResponse(tra, safe=False)

#                                                          # Entrada: nada; Salida: Los pasoa del trámite dada la llave id
#                                                          # en formato de diccionario
@api_view(["POST"])
@permission_classes((IsAuthenticated, EsAlumno | EsAdmin))
def get_pasos_tramites(request):
    args = PostParametersList(request)
    args.check_parameter(key='id', required=True)
    args = args.__dict__()
    tra = Paso.objects.filter(proceso_id=args['id']).order_by('numero').values()
    tra = [dict(t) for t in tra]
    return JsonResponse(tra, safe=False)