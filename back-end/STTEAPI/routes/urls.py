"""ESalMe URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path
from STTEAPI.controllers.controller import *
from STTEAPI.controllers.administrador import *
from STTEAPI.controllers.alumno import *
from STTEAPI.controllers.carta import *
from STTEAPI.controllers.carta_alumno import *
from STTEAPI.controllers.documento import *
from STTEAPI.controllers.paso import *
from STTEAPI.controllers.proceso import *
from STTEAPI.controllers.tramite import *
from django.contrib import admin
from django.conf.urls import url, include

# admin.site.register(Usuario, UserAdmin)
# admin.site.unregister(Group)

# Guarda los paths asociados a cada procedimiento del controller
urlpatterns = [
    path('admin/', admin.site.urls),
    path('login-admin/', login_admin),
    path('login-estudiante/', login_student),
    path('registro-estudiante/', registro_alumnos),
    path('documentos/', documentos),
    path('subir-documento/', subir_documento),
    path('logout/', logout),
    path('mostrar_alumnos/', get_students),
    path('agregar-proceso/', create_proceso),
    path('borrar-procesos/', delete_procesos),
    path('eliminar-documentos/', eliminar_documentos),
    path('request_restore/', request_restore),
    path('reset_password/', reset_password),
    path('validate_password_token/', validate_password_token),
    path('return_admins/', return_admin_list),
    path('return_student_list/', get_students),
    path('get_alumno/<id_alumno>/', get_student),
    path('eliminar_alumnos/', eliminar_alumnos),
    path('eliminar_tramites/', eliminar_tramites),
    path('eliminar_carta/', eliminar_carta),
    path('eliminar_administradores/', eliminar_administradores),
    path('agregar_administrador/', registro_administradores),
    path('get_tramites/', get_tramites),
    path('get_tramite/<id>', get_tramite_by_proceso),
    path('get_procesos', get_procesos),
    path('get_tramites_alumno/<id>', get_tramites_by_student_id),
    path('get_tramites_resumen/<proceso>/<month>/<status>',
         get_tramites_resumen),
    path('get_pasos_proceso/<proceso>', get_pasos_proceso),
    # New API endpoints
    path('agregar_alumnos/', upload_students),
    path('agregar_cartas/', create_letter_template),
    path('eliminar_cartas/', eliminar_plantilla_carta),
    path('editar_cartas/', editar_carta),
    path('obtener_cartas/', get_letters),
    path('obtener_alumnos/', get_students),
    path('obtener_cartas_alumnos/', get_students_letters),
    path('obtener_carta/<alumno>/<carta>/<admin>', get_student_letter),
    path('html_to_pdf', html_to_pdf),
    path('obtener_carta_para_editar/<alumno>/<carta>/<admin>',
         get_student_letter_to_edit)
]
