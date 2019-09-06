FROM python:3.5-slim-stretch AS runtime

WORKDIR /usr/src

ENV HOME=/usr/src PATH=/usr/src/bin:$PATH

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    apt-transport-https software-properties-common \
    ca-certificates \
    openssl \
    tzdata && \
    rm -rf /var/lib/apt/lists/*

FROM runtime AS development

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    build-essential \
    git \
    default-libmysqlclient-dev && \
    rm -rf /var/lib/apt/lists/*

ADD ./back-end/requirements.txt /usr/src/

RUN pip install -r requirements.txt 

ADD ./back-end /usr/src

CMD ["python", "manage.py", "runserver"]
