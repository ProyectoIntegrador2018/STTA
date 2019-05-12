# Despliegue del proyecto

El proyecto será desplegado en un servidor EC2 de ASW, con Apache. Los pasos para el despliegue son los siguientes.

## Conexión al AWS

1. Open an SSH client. (find out how to connect using PuTTY)
2. Locate your private key file (tramitesescolares_ubuntu.pem). The wizard automatically detects the key you used to launch the instance.
3. Your key must not be publicly viewable for SSH to work. Use this command if needed:
  chmod 400 tramitesescolares_ubuntu.pem
4. Connect to your instance using its Public DNS:
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



