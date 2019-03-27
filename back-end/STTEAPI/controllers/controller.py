import json

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


@api_view(["POST"])
@permission_classes((IsAuthenticated, EsAdmin))
def procesos(request):
    procs = Proceso.objects.values().annotate(pasos=Count('paso'))
    procs = [dict(p) for p in procs]
    return JsonResponse(procs, safe=False)

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
            raise APIExceptions.PermissionDenied

    return JsonResponse(1, safe=False)

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

@api_view(["POST"])
@permission_classes((IsAuthenticated, EsAdmin))
def pasos_procesos(request):
    args = PostParametersList(request)
    args.check_parameter(key='proceso', required=True)
    args = args.__dict__()
    pasos = Paso.objects.filter(proceso_id=args['proceso']).values()
    pasos = [dict(p) for p in pasos]
    return JsonResponse(pasos, safe=False)

@api_view(["POST"])
def registro_Alumnos(request):
    args = PostParametersList(request)
    args.check_parameter(key='email', required=True)
    args.check_parameter(key='password', required=True)
    args = args.__dict__()
    user = Usuario.objects.create_alumno(email=args['email'], password=args['password'])
    return JsonResponse(1, safe=False)

@api_view(["POST"])
@permission_classes((IsAuthenticated, EsAdmin))
def documentos(request):
    docs = Documento.objects.select_related('admin__usuario').values('id','nombre', 'fecha', 'contenido_subido',
                                                                     email=F('admin__usuario__email'),
                                                                     id_admin=F('admin_id'))

    print(docs)
    docs = [dict(p) for p in docs]
    return JsonResponse(docs, safe=False)

@api_view(["POST"])
@permission_classes((IsAuthenticated, EsAdmin))
def subir_documento(request):
    args = PostParametersList(request)
    args.check_parameter(key='filename', required=True)
    args.check_parameter(key='content', required=True)
    admin = Administrador.objects.get(usuario=request.user)
    doc = Documento.objects.create(nombre=args['filename'],contenido_subido=args['content'],admin=admin,
                                   proceso_id=args['proceso'])



    return JsonResponse(doc.id, safe=False)


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
    return JsonResponse({'token': token.key}, safe=False)

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
    return JsonResponse({'token': token.key}, safe=False)

@api_view(["POST"])
@permission_classes((IsAuthenticated, ))
def logout(request):
    request.user.auth_token.delete()
    return JsonResponse("SESION CERRADA de " + request.user.email, safe=False)


@api_view(["POST"])
def request_restore(request):
    args = PostParametersList(request)
    args.check_parameter(key='email', required=True)
    url_data = PasswordToken.request_uid_token(args['email'])

    try:
        send_mail(
            'Restablece tu contraseña',
            '<a href="http://127.0.0.1:3000/restaurar/' + str(url_data.uid) + '/' + url_data.token + '">Click aqui</a>',
            'STTE ITESM',
            [args['email']],
            fail_silently=False, )
    except:
        raise APIExceptions.SendMailError

    return JsonResponse(1, safe=False)

@api_view(["POST"])
def reset_password(request):
    args = PostParametersList(request)
    args.check_parameter(key='uid', required=True)
    args.check_parameter(key='token', required=True)
    args.check_parameter(key='password', required=True)
    check = PasswordToken.reset_password(args['uid'], args['token'],args['password'])

    if check:
        return JsonResponse(1, safe=False)
    else:
        raise APIExceptions.InvalidToken.set(detail="Reseteo de contraseña invalido")

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

#                                                           #Entrada: nada; Salida: una lista con todos los admins con su informacion de usuario
@api_view(["GET"])
@permission_classes((IsAuthenticated, EsAdmin))
def return_admin_list(request):
    admins = Administrador.objects.select_related('usuario').values('id','nombre','usuario__id', email=F('usuario__email'), last_login=F('usuario__last_login'))
    admins = [dict(adm) for adm in admins]
    return JsonResponse(admins, safe=False)


#                                                                                                                
@api_view(["GET"])
@permission_classes((IsAuthenticated, EsAdmin))
def return_student_list(request):
    stu = Alumno.objects.select_related('usuario').values('id','nombre','usuario__id', email=F('usuario__email'), last_login=F('usuario__last_login'))
    stu = [dict(adm) for adm in stu]
    return JsonResponse(stu, safe=False)

#                                                           #Entrada: numero de id de alumno ; Salida: todos sus datos
#                                                           #Se usa filter para recuperar el alumno, entonces se serializa el contenido y se regresa en formato json, se envía mediante HTTPResponse
@api_view(["GET"])
@permission_classes((IsAuthenticated, EsAdmin))
def return_student(request,id_alumno):
    stu = Alumno.objects.filter(id=id_alumno)
    stu = serializers.serialize('json',stu)
    return HttpResponse(stu, content_type='application/json')
