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
        if Alumno.objects.filter(matricula=alumno['Matrícula']).exists():
            a = Alumno.objects.get(matricula=alumno['Matrícula'])
        else:
            a = Alumno()
        a.term = alumno['Term']
        a.matricula = alumno['Matrícula']
        a.nombre = alumno['Nombre Completo']
        a.fecha_de_nacimiento = alumno['Fecha de nacimiento']
        a.nacionalidad = alumno['Nacionalidad']
        a.siglas_carrera = alumno['Abreviaturas Carrera']
        a.carrera = alumno['Carrera']
        a.semestre = alumno['Semestre']
        a.periodo_actual = alumno['Perido actual']
        a.term_admitido = alumno['Term Admitido']
        a.periodo_de_aceptacion = alumno['Periodo de aceptación']
        a.fechas_de_inscripcion = alumno['Fechas de inscripción']
        a.fechas_de_periodo = alumno['Fechas del periodo']
        a.fechas_de_inicio_de_clases = alumno['Fecha de inicio de clases']
        a.periodo_de_vacaciones = alumno['Periodo de vacaciones']
        a.promedio_acumulado = alumno['Promedio acumulado']
        a.promedio_semestre_anterior = alumno['Promedio del semestre anterior']
        a.promedio_de_certificado = alumno['Promedio de certificado']
        a.total_de_materias_de_carrera = alumno['Total de materias de la carrera']
        a.mes_anio_de_terminacion = alumno['Mes y año de terminación']
        a.mes_anio_de_graduacion = alumno['Mes y año de graduación']
        a.materias_aprobadas = alumno['# materias aprobadas']
        a.nombre_materias_inscritas = alumno['Nombre de materias inscritas']
        a.lugar_en_ranking = alumno['Lugar en el ranking']
        a.total_alumnos_en_la_generacion = alumno['Total alumnos en la generación']
        a.documentos_instituto = alumno['Documentos en el Instituto']
        a.save()

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

    return eliminar_datos(request, Alumno, 'alumno')
