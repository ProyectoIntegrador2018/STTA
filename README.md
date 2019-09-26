# Sistema de Consulta de Trámites Escolares

[![Maintainability](https://api.codeclimate.com/v1/badges/c60f047b52fa6baaa7f9/maintainability)](https://codeclimate.com/github/ProyectoIntegrador2018/STTA/maintainability)


Aplicación web que permite visualizar el estatus de los trámites escolares en la operación interna y además visualizar la consulta por parte de los usuarios hasta que concluya su trámite o petición.
    
## Tabla de Contenidos

* [Detalles del cliente](#detalles-del-cliente)
* [URLs de ambiente](#urls-de-ambiente)
* [Equipo](#equipo)
* [Recursos de gestión](#recursos-de-gesti%c3%b3n)
* [Stack Tecnológico](#stack-tecnol%c3%b3gico)
* [Backend](#backend)
* [Frontend](#frontend)

## Detalles del cliente

| Nombre             | Email         | Rol                                      |
| ------------------ | ------------- | ---------------------------------------- |
| Ing. Amanda Quiroz | amanda@tec.mx | Dirección de Servicios Escolares del Tec |

## URLs de ambiente

* Producción - [Trámites Escolares](https://www.tramitesescolares.com.mx)
* Desarrollo - [Github](https://github.com/ProyectoIntegrador2018/STTA)

## Equipo

| Nombre                       | Email              | Rol           |
| ---------------------------- | ------------------ | ------------- |
| Marcela Maria Garza Botello  | A00815888@itesm.mx | Scrum Master  |
| Enrique Barragán González    | A01370878@itesm.mx | Product Owner |
| Juan Pablo Galaz Chávez      | A01251406@itesm.mx | Desarrollador |
| Jesús Eugenio Alatorre Cantú | A00819508@itesm.mx | Desarrollador |

## Recursos de gestión

* [Github](https://github.com/ProyectoIntegrador2018/STTA)
* [Backlog](https://github.com/ProyectoIntegrador2018/STTA/projects/1)
* [Documentación](https://drive.google.com/drive/folders/1e7J2xKsqwhiYtfO7NGgFIzVfx1me6oOo?usp=sharing)

## Stack Tecnológico

### Librerías Front End:
* ReactJS
* Ant Desing

### Librerias Back End:
* Django(Framework de Python)

### Persistencia de datos:
* MySQL

## Desarollo

### 1. Clonar el repositorio
```
$ git clone https://github.com/ProyectoIntegrador2018/STTA.git
```

## Backend

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
cd back-end
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

## Frontend

### Stack de Tecnologías

Front-End:
* [JavaScript](https://www.javascript.com) - Lenguaje de programación interpretado.
* [React](https://reactjs.org) - Una biblioteca de JavaScript para construir interfaces de usuario
* [Node.js](https://nodejs.org/es/) - Un entorno de ejecución para JavaScript construido con el motor de JavaScript V8 de Chrome.

### Instalacion del Front-end

Cambiar al directorio meta
```
cd front-end
```

Pasos para instalar dependencias de proyecto Front-End:

Instalar dependencias con npm
```
npm install
```

Las librerias que se instalan son:
* ant-design-pro
* antd
* fetch-http-client
* react-router-dom
* universal-cookie

### Ejecución del Proyecto

Ejecución de proyecto Front-End
```
npm run start
```

### Lanzamiento

Pasos para lanzar proyecto Front-End a s3:

Crear paquete de aplicación en React.
```
npm run build
```

Sincornizar directorio de construcción con S3
```
aws s3 sync build/ s3://www.tramitesescolares.com.mx
```

Lanzamiento rapido invalidando caches.
```
npm run deploy
```
