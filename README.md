# Sistema de Trazabilidad de Trámites Escolares

<a href="https://codeclimate.com/github/ProyectoIntegrador2018/STTA/maintainability"><img src="https://api.codeclimate.com/v1/badges/c60f047b52fa6baaa7f9/maintainability" /></a>


Aplicación web que permite visualizar el estatus de los trámites escolares en la operación interna y además visualizar la consulta por parte de los usuarios hasta que concluya su trámite o petición.

## Tabla de contenidos

* [Detalles del cliente](#detalles-del-cliente)
* [URLs de ambiente](#urls-de-ambiente)
* [Equipo](#equipo)
* [Recursos de gestión](#recursos-de-gestion)
* [Stack tecnológico](#Stack-Tecnologico)
* [Desarrollo](#desarrollo)
* [Repositorios](#clonar-repositorioa)
* [Backend](#backend)
* [Frontend](#frontend)

## Detalles del cliente

| Nombre | Email | Rol |
| ------- | ----- | --- |
| Ing. Amanda Quiroz | amanda@tec.mx | Dirección de Servicios Escolares del Tec |

## URLs de ambiente

* Producción - [Trámites Escolares](https://www.tramitesescolares.com.mx)
* Desarrollo - [Github](https://github.com/ProyectoIntegrador2018/STTA)

## Equipo

| Nombre | Email | Rol |
| ------- | ----- | --- |
| Andrea Chacón Balderas | A01327020@itesm.mx | Scrum Master |
| Jorge Luis Mendez Montoya | A00816559@itesm.mx | Product Owner |
| Laura Jaideny Pérez Gómez | A01271904@itesm.mx | Desarrollador |
| Erik Eduardo Velasco Gómez | A00510780@itesm.mx | Desarrollador |

## Recursos de gestión

* [Github](https://github.com/ProyectoIntegrador2018/stta-frontend)
* [Backlog](https://github.com/ProyectoIntegrador2018/stta-backend/projects/1)
* [Documentación](https://drive.google.com/drive/folders/15AvY0wG4RHUDM6egkHuAgLJnr3TcDuRj?usp=sharing)

## Stack Tecnológico
### Librerías Front End:
* ReactJS
* Ant Desing

### Librerias Back End:
* Django(Framework de Python)

### Persistencia de datos:
* MySQL

## Desarollo

### 1. Clonar los repositorios
Backend
```
$ git clone https://github.com/ProyectoIntegrador2018/stte-backend.git
```

Frontend
```
$ git clone https://github.com/ProyectoIntegrador2018/stte-frontend.git
```

## Backend

## Caracteristicas

- Django 2.0+
- Uses [Pipenv](https://github.com/kennethreitz/pipenv) - the officially recommended Python packaging tool from Python.org.
- Development, Staging and Production settings with [django-configurations](https://django-configurations.readthedocs.org).
- Get value insight and debug information while on Development with [django-debug-toolbar](https://django-debug-toolbar.readthedocs.org).
- Collection of custom extensions with [django-extensions](http://django-extensions.readthedocs.org).
- HTTPS and other security related settings on Staging and Production.
- Procfile for running gunicorn with New Relic's Python agent.
- PostgreSQL database support with psycopg2.

## Cómo instalar

```bash
$ django-admin.py startproject \
  --template=https://github.com/jpadilla/django-project-template/archive/master.zip \
  --name=Procfile \
  --extension=py,md,env \
  project_name
$ mv example.env .env
$ pipenv install --dev
```

## Variables del ambiente

These are common between environments. The `ENVIRONMENT` variable loads the correct settings, possible values are: `DEVELOPMENT`, `STAGING`, `PRODUCTION`.

```
ENVIRONMENT='DEVELOPMENT'
DJANGO_SECRET_KEY='dont-tell-eve'
DJANGO_DEBUG='yes'
```

These settings(and their default values) are only used on staging and production environments.

```
DJANGO_SESSION_COOKIE_SECURE='yes'
DJANGO_SECURE_BROWSER_XSS_FILTER='yes'
DJANGO_SECURE_CONTENT_TYPE_NOSNIFF='yes'
DJANGO_SECURE_HSTS_INCLUDE_SUBDOMAINS='yes'
DJANGO_SECURE_HSTS_SECONDS=31536000
DJANGO_SECURE_REDIRECT_EXEMPT=''
DJANGO_SECURE_SSL_HOST=''
DJANGO_SECURE_SSL_REDIRECT='yes'
DJANGO_SECURE_PROXY_SSL_HEADER='HTTP_X_FORWARDED_PROTO,https'
```

## Frontend

### Instalar librerías  

Ya instalado npm
```
$ npm install
```

Las librerías que se instalan son:
* ant-desing-pro
* antd
* fetch-http-client
* react-router-dom
* universal-cookie

### Ejecutar

Dentro del folder del proyecto ejecutar:
```
$ npm run start
```

### Detener el proyecto
Para detener el proyecto simplemente oprime estas teclas:
```
$ CTRL+C
```
