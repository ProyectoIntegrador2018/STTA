"""
WSGI config for ESalMe project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/2.1/howto/deployment/wsgi/
"""

import os
import pymysql
from django.core.wsgi import get_wsgi_application

pymysql.install_as_MySQLdb()
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'STTEAPI.settings')

application = get_wsgi_application()
