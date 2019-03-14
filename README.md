# Sistema de Trazabilidad de Trámites Escolares

<a href="https://codeclimate.com/github/ProyectoIntegrador2018/stte-frontend/maintainability"><img src="https://api.codeclimate.com/v1/badges/61a732391368d0c05ca7/maintainability" /></a>



Aplicación web que permite visualizar el estatus de los trámites escolares en la operación interna y además visualizar la consulta por parte de los usuarios hasta que concluya su trámite o petición.

## Tabla de contenidos

* [Detalles del cliente](#detalles-del-cliente)
* [URLs de ambiente](#urls-de-ambiente)
* [Equipo](#equipo)
* [Recursos de gestion](#recursos-de-gestion)
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

* Production - TBD
* Development - TBD

## Equipo

| Nombre | Email | Rol |
| ------- | ----- | --- |
| Andrea Chacón Balderas | A01327020@itesm.mx | Scrum Master |
| Jorge Luis Mendez Montoya | A00816559@itesm.mx | Product Owner |
| Laura Jaideny Pérez Gómez | A01271904@itesm.mx | Desarrollador |
| Erik Eduardo Velasco Gómez | A00510780@itesm.mx | Desarrollador |

## Recursos de gestion

* [Github](https://github.com/ProyectoIntegrador2018/stta-frontend)
* [Backlog](https://github.com/ProyectoIntegrador2018/stta-backend/projects/1)
* [Documentación](https://drive.google.com/drive/folders/15AvY0wG4RHUDM6egkHuAgLJnr3TcDuRj?usp=sharing)

## Stack Tecnologico
### Librerias Front End:
* ReactJS
* Ant Desing

### Librerias Back End:
* Flask(Framework de Python)

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

### Instalar librerias  

Ya instalado si se está usando Python 2 >=2.7.9 o Python 3 >=3.4
* Flask
```
$ pip install -U Flask
```
* flask-cors
```
$ pip install -U flask-cors
```
* PyMySQL
```
$ pip install -U PyMySQL
```
* status
```
$ pip install -U status
```
### Ejecutar

Dentro del folder del proyecto ejecutar:
```
$ python -m flask run
```

### Detener el proyecto
Para detener el servidor simplemente oprime estas teclas:
```
$ CTRL+C
```

## Frontend

### Instalar librerias  

Ya instalado npm
```
$ npm install
```

Las librerias que se instalan son:
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
