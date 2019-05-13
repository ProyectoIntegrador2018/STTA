# Despliegue del proyecto

El proyecto será desplegado en un servidor EC2 de ASW, con Apache. Los pasos para el despliegue son los siguientes.

## Conexión al AWS

1. Abrir un cliente SSH. (descubre cómo conectarte usando PuTTY)
2. Localice su archivo de clave privada (tramitesescolares_ubuntu.pem). El asistente detecta automáticamente la clave que utilizó para iniciar la instancia.
3. Su clave no debe ser visible públicamente para que SSH funcione. Use este comando si es necesario: chmod 400 tramitesescolares_ubuntu.pem
4. Conéctese a su instancia usando su DNS público:
  ec2-18-191-151-193.us-east-2.compute.amazonaws.com

```
$ ssh -i "tramitesescolares_ubuntu.pem" ubuntu@ec2-18-191-151-193.us-east-2.compute.amazonaws.com
```

### 1. Clonar los repositorios

Clonar o descargar los proyectos en el servidor de desarrollo. 

Backend
```
$ git clone https://github.com/ProyectoIntegrador2018/stte-backend.git
```

Frontend
```
$ git clone https://github.com/ProyectoIntegrador2018/stte-frontend.git
```

## Backend

### Instalar librerías  

Ya instalado Python 3 >= 3.4

Instalar las librerías del proyecto que se encuentran en requirements.txt
```
$ pip install -r requirements.tx
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

### Construir

Dentro del folder del proyecto ejecutar el compando de construcción:
```
$ npm run build
```

Subir el documento al servidor de AWS
```
$ npm run deploy
```
o
```
$ aws s3 sync build/ s3://www.tramitesescolares.com.mx
```



