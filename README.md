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
* Ant Design

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

### Instalacion del Proyecto

Se recomienda utilizar Docker para correr la aplicación. Es necesario instalar docker y docker-compose.

Cambiar al directorio meta
```
cd back-end
```

Poner las variables de ambiente necesarias (contactar al equipo de desarrollo para obtenerlas)
```
STTA/back-end ~ cat web-variables.env
DB_NAME=STTE
DB_USER=root
DB_PASSWORD=3x4mPl3P4sSW0rD!
DB_HOST=localhost
DB_PORT=3306
SENDGRID_API_KEY=valid_sendgrid_key
```

Crear la base de datos y correr las migraciones
```
$ docker-compose exec mysql mysql -u root -p
Enter password: 3x4mPl3P4sSW0rD!
mysql> CREATE DATABASE STTE;
mysql> \quit
$ docker-compose exec web python manage.py migrate STTEAPI
$ docker-compose exec web python manage.py migrate
```

Iniciar la aplicación
```
docker-compose up
```

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

Sincronizar directorio de construcción con S3
```
aws s3 sync build/ s3://www.tramitesescolares.com.mx
```

Lanzamiento rapido invalidando caches.
```
npm run deploy
```
