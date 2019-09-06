# Autoservicio de Cartas y Constancias Académicas

Proyecto elaborado para el departamento de Escolar del Campus Monterrey con el fin de ser un autoservicio de cartas y constancias académicas.

## Tabla de Contenidos
* [URL del Sitio](#URL-del-Sitio)
* [Detalles del Cliente](#Detalles-del-Cliente)
* [Equipo](#Equipo)
* [Desarrollo](#Desarrollo)

## URL del Sitio
https://www.tramitesescolares.com.mx/

## Detalles del Cliente
Nombre | Correo | Rol
------ | ------ | ---
Ing. Amanda Quiroz Vázquez | amanda@tec.mx | Product Owner

## Equipo
Nombre | Matrícula | Rol
------ | --------- | ---
Oscar Laureano | A00819139 | Dev
Lucía Oseguera | A00818345 | Dev
Abraham Pineda | A00759440 | Scrum Master
Luis Rosales   | A01280221 | Product Owner Proxy

## Desarrollo

Consideraciones: En todo momento una vez que sea clonado el repositorio y la instalacion del virtual enviroment este hecha. SIEMPRE se deve trabar con el virtual enviroment encendido.

### Stack de Tecnologías

Back-End:
* [Python](https://www.python.org) - Lenguaje de programación interpretado cuya filosofía hace hincapié en una sintaxis que favorezca un código legible.
* [Django](https://www.djangoproject.com) - Framework de desarrollo web de código abierto, escrito en Python.

Base de datos:
* [MySQL](https://www.mysql.com) - Es un sistema de gestión de bases de datos relacional 

### Requerimientos de la maquina
Instalar cairo

```sh
$ brew install cairo
```

Instalar pango
```sh
$ brew install pango
```

### Instalacion del Proyecto

Cambiar al directorio meta
```
cd NOMBRE_DE_DIRECTORIO
```

Clonar el repositorio
```
git clone https://github.com/ProyectoIntegrador2018/autoservicio-cartas-back.git
```

Pasos para instalar dependencias de proyecto Back-End:

Instalar virtualenv 
```sh
$ pip install virtualenv
```

Crear ambiente virtual
```sh
$ virtualenv -p /usr/bin/python3.6 venv
```

Activar ambiente virtual
```sh
$ source venv/bin/activate
```

Instalar todas las dependencias automaticamente:

```sh
$ pip install -r requirements.txt
```

Instalar las dependencias manualmente:

Instalar Django rest framework
```sh
$ pip install djangorestframework
```

Instalar Django cors headers
```sh
$ pip install django-cors-headers
```

Instalar weasyprint
```sh
$ pip install weasyprint
```

Instalar Werkzeug
```sh
$ pip install -U Werkzeug
```

Instalar PyMySQL
```sh
$ pip install PyMySQL
```

Es sugerido actualizar las depencias con el siguiente commando:

Guardar dependencias

```sh
$ pip freeze > requirements.txt
```

### Ejecución del Proyecto

Ejecucion de proyecto Back-End:
```
$ python manage.py runserver
```

### Posibles excepciones

* [mysqlclient 1.3.13 or newer is required](https://stackoverflow.com/questions/55657752/django-installing-mysqlclient-error-mysqlclient-1-3-13-or-newer-is-required)

### Lanzamiento

Pasos para lanzar proyecto mediante Elastic Beanstalk

* Crear zip del proyecto 
* Si estas en mac limpiar zip - zip -d autoservicio-cartas-back.zip __MACOSX/\*
* Acceder a la consola de aws
* Seleccionar el servicio de Elastic Beanstalk
* Subir zip dando click en boton "Upload and Deploy"



