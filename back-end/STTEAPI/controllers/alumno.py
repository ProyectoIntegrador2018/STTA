import re
import json
import csv
from django.core import serializers
from django.db import transaction
from django.http import HttpResponse
from rest_framework.decorators import api_view, permission_classes
from STTEAPI.controllers.utils import *
from STTEAPI.settings.authentication import IsAuthenticated

# CREATE
@api_view(["POST"])
def registro_alumnos(request):
    """Guarda la información del alumno cuando se va a registrar.

    Args:
    request: API request.
    """
    args = verify_post_params(request, ['email', 'password', 'nombre',
                                        'apellido'])
    if not re.match(EMAIL_REGEX, args['email']):
        raise exceptions.PermissionDenied(detail="Email inválido")
    try:
        user = Usuario.objects.create_alumno(
            email=args['email'],
            password=args['password'],
            nombre=args['nombre'] + ' ' + args['apellido'],
            matricula=args['email'].split('@')[0].upper()
        )
    except IntegrityError as e:
        raise exceptions.PermissionDenied(detail="Email ya registrado")
    return JsonResponse(1, safe=False)


# READ
@api_view(["POST"])
def login_student(request):
    """Corrobora las credenciales del inicio de sesión del estudiante.

    Args:
    request: API request.
    """
    al, user, token = handle_login(request, Alumno)
    return JsonResponse({'token': token.key, 'matricula': user.email,
                         'nombre': al.nombre}, safe=False)


@api_view(["GET"])
@permission_classes((IsAuthenticated, EsAdmin))
def get_student(request, id_alumno):
    """Recuperar el alumno en formato json.
    Args:
    request: HTTP request.
    id_alumno: Numero de id de alumno.
    """
    del request
    stu = Alumno.objects.filter(id=id_alumno)
    stu = serializers.serialize('json', stu)
    return HttpResponse(stu, content_type='application/json')


@api_view(["POST"])
@permission_classes((IsAuthenticated, EsAdmin))
def bulk_upload_student(request):
    """Procesamiento bulk de un archivo csv.
    Args:
    request: HTTP request.
    id_alumno: Numero de id de alumno.
    """
    with open(request.data.file, newline='') as csvfile:
        reader = csv.reader(csvfile, delimiter=',', quotechar='"')
        for i, row in enumerate(reader):
            if i == 0 or not row[1]:
                continue
            a = Alumno()
            a.term = row[0]
            a.matricula = row[1]
            a.nombre = row[2]
            a.fecha_de_nacimiento = row[3]
            a.nacionalidad = row[4]
            a.siglas_carrera = row[5]
            a.carrera = row[6]
            a.semestre = row[7]
            a.periodo_actual = row[8]
            a.term_admitido = row[9]
            a.periodo_de_aceptacion = row[10]
            a.fechas_de_inscripcion = row[11]
            a.fechas_de_periodo = row[12]
            a.fechas_de_inicio_de_clases = row[13]
            a.periodo_de_vacaciones = row[14]
            a.promedio_acumulado = row[15]
            a.promedio_semestre_anterior = row[16]
            a.promedio_de_certificado = row[17]
            a.total_de_materias_de_carrera = row[18]
            a.mes_anio_de_terminacion = row[19]
            a.mes_anio_de_graduacion = row[20]
            a.materias_aprobadas = row[21]
            a.nombre_materias_inscritas = row[22]
            a.lugar_en_ranking = row[23]
            a.total_alumnos_en_la_generacion = row[23]
            a.documentos_instituto = row[24]
            a.posible_graduacion = 0
            a.save()
    return HttpResponse({"status": "ok"}, content_type='application/json')


@api_view(["GET"])
@permission_classes((IsAuthenticated, EsAlumno | EsAdmin))
def get_students(request):
    """Get all students.

    Args:
    request: API request.
    """
    del request
    tra = list(Alumno.objects.all().values('id', 'nombre', 'matricula'))
    return JsonResponse(tra, safe=False)


# UPDATE
@api_view(["POST"])
def upload_students(request):
    """Creates or updates a student.

    Args:
    request: API request.
    """
    args = verify_post_params(request, ['content'])
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


# DELETE
def handle_delete_student_dependents(id):
    try:
        carta_alumnos = CartaAlumno.objects.filter(alumno=id)
        for carta_alumno in carta_alumnos:
            carta_alumno.delete()

        tramites = Tramitealumno.objects.filter(alumno=id)
        for tramite in tramites:
            tramite.delete()

    except IntegrityError:
        raise APIExceptions.PermissionDenied


@api_view(["POST"])
@permission_classes((IsAuthenticated, EsAdmin))
@transaction.atomic
def eliminar_alumnos(request):
    """Deletes students and then returns a JSON response.

    Args:
    request: API request.
    """
    args = verify_post_params(request, ['alumno'], True)
    for p in args['alumno']:
        handle_delete_student_dependents(p['id'])

    return eliminar_datos(request, Alumno, 'alumno', eliminar_usuarios)
