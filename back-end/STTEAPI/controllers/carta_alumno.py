from datetime import datetime
from django.db import transaction
from django.http import HttpResponse
from django.template import loader
from rest_framework.decorators import api_view, permission_classes
from STTEAPI.controllers.utils import *
from STTEAPI.settings.authentication import IsAuthenticated
from weasyprint import HTML


# CREATE
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
                                        siglas_carrera=alumno[
                                            0].siglas_carrera,
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


# READ
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
            id_alumno=p['id_alumno'],
            id_carta=p['id_carta'])
        docs.delete()

    return eliminar_datos(request, CartaAlumno, 'documentos',
                          _eliminar_con_alumno_carta)
