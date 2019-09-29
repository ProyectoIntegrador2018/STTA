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
    path('procesos/', procesos),
    path('documentos/', documentos),
    path('pasos-procesos/', pasos_procesos),
    path('subir-documento/', subir_documento),
    path('logout/', logout),
    path('mostrar_alumnos/', return_student_list),
    path('agregar-proceso/', agregar_proceso),
    path('borrar-procesos/', borrar_procesos),
    path('eliminar-documentos/', eliminar_documentos),
    path('request_restore/', request_restore),
    path('reset_password/', reset_password),
    path('validate_password_token/', validate_password_token),
    path('return_admins/', return_admin_list),
    path('return_student_list/', return_student_list),
    path('get_alumno/<id_alumno>/', return_student),
    path('eliminar_alumnos/', eliminar_alumnos),
    path('eliminar_tramites/', eliminar_tramites),
    path('eliminar_carta/', eliminar_carta),
    path('eliminar_administradores/', eliminar_administradores),
    path('agregar_administrador/', registro_administradores),
    path('get_tramites/', return_datos_tramite),
    path('get_datos_tramite_alumno/<id>', get_datos_tramite_alumno),
    path('get_pasos_tramites/', get_pasos_tramites),
    path('get_tramites_alumno/<matricula>', return_tramite_alumnos),
    path('get_tramite_alumnos_status', return_tramite_alumnos_status),
    path('get_tramite_alumnos_status_week',
         return_tramite_alumnos_status_week),
    path('get_tramite_alumnos_transferencia', return_tramite_transferencia),
    path('get_tramite_alumnos_transferencia_pasos',
         return_tramite_transferencia_pasos),
    path('get_procesos', return_procesos),
    path('get_procesos_pasos/<proceso>/', return_procesos_pasos),
    path('get_tramite/<proceso>/', return_tramite),
    path('get_tramites_resumen/<proceso>/<month>/<status>',
         get_tramites_resumen),
    path('get_pasos_proceso/<proceso>', get_pasos_proceso),
    # New API endpoints
    path('agregar_alumnos/', upload_students),
    path('agregar_cartas/', create_letter_template),
    path('eliminar_cartas/', eliminar_plantilla_carta),
    path('obtener_cartas/', get_letters),
    path('obtener_alumnos/', get_students),
    path('obtener_cartas_alumnos/', get_students_letters),
    path('obtener_carta/<id_alumno>/<id_carta>', get_student_letter)
]
