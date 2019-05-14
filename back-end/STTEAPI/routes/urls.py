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
from STTEAPI.controllers import controller
from django.contrib import admin
from django.conf.urls import url, include

#admin.site.register(Usuario, UserAdmin)
#admin.site.unregister(Group)

#                                                          #Guarda los paths asociados a cada procedimiento del controller
urlpatterns = [
    path('admin/', admin.site.urls),
    path('login-admin/', controller.login_admin),
    path('login-estudiante/', controller.login_student),
    path('registro-estudiante/', controller.registro_Alumnos),
    path('procesos/', controller.procesos),
    path('documentos/', controller.documentos),
    path('pasos-procesos/', controller.pasos_procesos),
    path('subir-documento/', controller.subir_documento),
    path('logout/', controller.logout),
    path('mostrar_alumnos/', controller.return_student_list),
    path('agregar-proceso/',controller.agregar_proceso),
    path('borrar-procesos/',controller.borrar_procesos),
    path('eliminar-documentos/',controller.eliminar_documentos),
    path('request_restore/',controller.request_restore),
    path('reset_password/',controller.reset_password),
    path('validate_password_token/', controller.validate_password_token),
    path('return_admins/',controller.return_admin_list),
    path('return_student_list/',controller.return_student_list),
    path('get_alumno/<id_alumno>/', controller.return_student),
    path('eliminar_alumnos/', controller.eliminar_alumnos),
    path('eliminar_tramites/', controller.eliminar_tramites),
    path('eliminar_administradores/', controller.eliminar_administradores),
    path('agregar_administrador/',controller.registro_administradores),
    path('get_tramites/',controller.return_datos_tramite),
    path('get_datos_tramite_alumno/<id>',controller.get_datos_tramite_alumno),
    path('get_pasos_tramites/',controller.get_pasos_tramites),
    path('get_tramites_alumno/<matricula>', controller.return_tramite_alumnos),
    path('get_tramite_alumnos_status', controller.return_tramite_alumnos_status),
    path('get_tramite_alumnos_status_week', controller.return_tramite_alumnos_status_week),
    path('get_tramite_alumnos_transferencia', controller.return_tramite_transferencia),
    path('get_tramite_alumnos_transferencia_pasos', controller.return_tramite_transferencia_pasos),
    path('get_procesos', controller.return_procesos),
     path('get_procesos_pasos/<proceso>/', controller.return_procesos_pasos),
      path('get_tramite/<proceso>/', controller.return_tramite)  ,
    path('get_tramites_resumen/<proceso>/<month>/<status>',controller.get_tramites_resumen ),
    path('get_pasos_proceso/<proceso>', controller.get_pasos_proceso)
]