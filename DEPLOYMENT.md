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

### Instalar librerias  

Ya instalado Python 3 >=3.4

Instalar las librerias del proyecto que se encuentran en requieremnts.txt
```
$ pip install -r requirements.tx
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

### Construir

Dentro del folder del proyecto ejecutar el compando de cosntruccion:
```
$ npm run build
```

Mover el proyecto al folder www con el script
```
$ npm run move
```

En apache

```
$ cd /etc/apache2/sites-available
```

* Crear archivo conf en /etc/apache2/sites-available
```
<VirtualHost *:80>
  ServerName [sitio]
  ServerAdmin you@yourDomain
  DocumentRoot /var/www/[folder destino]

  # Serve static files like the minified javascript from npm run-script build
  Alias /static /var/www/[folder destino]/static
  <Directory /var/www/[folder destino]/static>
    Require all granted
  </Directory>
</VirtualHost>
```

* Habilitar sitio
```
a2ensite [nombre del archivo conf]
```
* Resetear apache
```
systemctl restart apache2
```
