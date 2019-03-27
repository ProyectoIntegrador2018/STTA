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
    path('get_alumno/<id_alumno>/', controller.return_student),
    path('eliminar_alumnos/', controller.eliminar_alumnos),
    path('eliminar_administradores/', controller.eliminar_administradores)

]

