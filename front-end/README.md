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

El stack de tecnologias se agrupa en dos partes. Tecnologias para front-end y tecnologias para back-end. Ambos grupos de tecnologias coexisten dentro del cloud service provider AWS.

### Stack de Tecnologías

Front-End:
* [JavaScript](https://www.javascript.com) - Lenguaje de programación interpretado.
* [React](https://reactjs.org) - Una biblioteca de JavaScript para construir interfaces de usuario
* [Node.js](https://nodejs.org/es/) - Un entorno de ejecución para JavaScript construido con el motor de JavaScript V8 de Chrome.

### Instalacion del Proyecto

Cambiar al directorio meta
```
cd NOMBRE_DE_DIRECTORIO
```

Clonar el repositorio
```
git clone https://github.com/ProyectoIntegrador2018/autoservicio-cartas-front.git
```

Pasos para instalar dependencias de proyecto Front-End:

Instalar dependencias con npm
```
npm install
```

Las librerias que se instalan son:
* ant-desing-pro
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

