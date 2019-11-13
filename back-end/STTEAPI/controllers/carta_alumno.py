from datetime import datetime
import json

from django.db import transaction
from django.http import HttpResponse
from django.template import loader
from rest_framework.decorators import api_view, permission_classes
from STTEAPI.controllers.utils import *
from STTEAPI.settings.authentication import IsAuthenticated
from weasyprint import HTML
from datetime import date


# CREATE
@api_view(["GET"])
# @permission_classes((IsAuthenticated, EsAdmin))
def get_student_letter(request, alumno, carta, admin):
    """Get a student letter.

    Args:
    request: API request.
    id_alumno: Student ID.
    id_carta: Letter ID.
    """
    del request
    # Get letter by id_carta
    carta = Carta.objects.get(id=carta)
    # Get student by id_student
    alumno = Alumno.objects.get(id=alumno)
    admin = Administrador.objects.get(id=admin)

    html = carta_html_to_string(carta, alumno, admin)

    # Create carta alumno
    CartaAlumno.objects.create(carta=carta,
                               alumno=alumno,
                               administrador=admin)

    # Create response
    pdf_file = HTML(string=html).write_pdf()
    response = HttpResponse(pdf_file, content_type="application/pdf")
    # Response: inline to open pdf reader on browser | attachment to download .
    response['Content-Disposition'] = 'filename=output.pdf'
    return response


@api_view(["POST"])
# @permission_classes((IsAuthenticated, EsAdmin))
def html_to_pdf(request):
    """Get a student letter.

    Args:
    request: API request.
    id_alumno: Student ID.
    id_carta: Letter ID.
    """
    # Get letter by id_carta
    body = json.loads(request.body)
    carta_id = int(body.get('carta_id'))
    student_id = int(body.get('student_id'))
    admin_id = int(body.get('admin_id'))

    carta = Carta.objects.get(id=carta_id)
    # Get student by id_student
    alumno = Alumno.objects.get(id=student_id)

    admin = Administrador.objects.get(id=admin_id)

    # Calculated data
    today = datetime.today()
    # dd/mm/YY
    current_date = today.strftime("%d/%m/%Y")

    # Send parameters student data to letter
    html = body.get('content')

    # Create carta alumno
    CartaAlumno.objects.create(carta=carta,
                               alumno=alumno,
                               administrador=admin)

    # Create response
    pdf_file = HTML(string=html).write_pdf()
    response = HttpResponse(pdf_file, content_type="application/pdf")
    # Response: inline to open pdf reader on browser | attachment to download .
    response['Content-Disposition'] = 'filename=output.pdf'
    return response


@api_view(["GET"])
# @permission_classes((IsAuthenticated, EsAdmin))
def get_student_letter_to_edit(request, alumno, carta, admin):
    """Get a student letter.

    Args:
    request: API request.
    id_alumno: Student ID.
    id_carta: Letter ID.
    """
    del request
    # Get letter by id_carta
    carta = Carta.objects.get(id=carta)
    # Get student by id_student
    alumno = Alumno.objects.get(id=alumno)
    admin = Administrador.objects.get(id=admin)

    # Calculated data
    html = carta_html_to_string(carta, alumno, admin)

    # Create response
    response_data = {'carta': html}
    return HttpResponse(json.dumps(response_data),
                        content_type="application/json")


# READ
@api_view(["GET"])
@permission_classes((IsAuthenticated, EsAlumno | EsAdmin))
def get_students_letters(request):
    """Get all student letters.

    Args:
    request: API request.
    """
    del request
    carta = CartaAlumno.objects.select_related('carta', 'alumno').values(
        'id', 'alumno__matricula', 'alumno__nombre', 'carta__nombre',
        'fecha_creacion')
    carta = [dict(c) for c in carta]
    return JsonResponse(carta, safe=False)


# UPDATE
# DELETE
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
            alumno=p['alumno'],
            carta=p['carta'])
        docs.delete()

    return eliminar_datos(request, CartaAlumno, 'documentos',
                          _eliminar_con_alumno_carta)


def carta_html_to_string(carta, alumno, admin):
    today = datetime.today()
    # dd/mm/YY
    current_date = today.strftime("%d/%m/%Y")

    # Send parameters student data to letter
    html = loader.render_to_string(
        carta.nombre,
        {'nombre': alumno.nombre,
         'matricula': alumno.matricula,
         'siglas_carrera': alumno.siglas_carrera,
         'carrera': alumno.carrera,
         'semestre': alumno.semestre,
         'periodo_de_aceptacion': alumno.periodo_de_aceptacion,
         'posible_graduacion': alumno.posible_graduacion,
         'fecha_de_nacimiento': alumno.fecha_de_nacimiento,
         'nacionalidad': alumno.nacionalidad,
         'fecha_actual': current_date,
         'fechas_de_periodo': alumno.fechas_de_periodo,
         'nombre_materias_inscritas': alumno.nombre_materias_inscritas,
         'periodo_de_vacaciones': alumno.periodo_de_vacaciones,
         'promedio_acumulado': alumno.promedio_acumulado,
         'promedio_semestre_anterior': alumno.promedio_semestre_anterior,
         'total_de_materias_de_carrera': alumno.total_de_materias_de_carrera})

    return html
