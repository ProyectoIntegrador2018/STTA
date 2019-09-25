FROM python:3.6-slim-stretch
EXPOSE 8000
ENV PYTHONUNBUFFEREF 1
RUN mkdir /stte-back
WORKDIR /stte-back
COPY . /stte-back/

RUN apt-get update && apt-get install -y gcc \
  && apt-get install -y libcairo2-dev && apt-get install -y libghc-pango-dev \
  && pip install -r requirements.txt

CMD ["uwsgi", "--http", ":8000", "--module", "STTEAPI.settings.wsgi"]
