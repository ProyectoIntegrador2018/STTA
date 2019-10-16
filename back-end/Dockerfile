FROM python:3.6-slim-stretch
EXPOSE 8000
ENV PYTHONUNBUFFEREF 1
RUN mkdir /stte-back

COPY requirements.txt /stte-back/requirements.txt

WORKDIR /stte-back


RUN apt-get update && apt-get install -y \
  gcc \
  python-dev \
  default-libmysqlclient-dev \
  libcairo2-dev \
  libghc-pango-dev \
  && pip install mysqlclient \
  && pip install -r requirements.txt


COPY . /stte-back/


CMD ["uwsgi", "--http", ":8000", "--module", "STTEAPI.settings.wsgi"]
