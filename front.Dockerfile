FROM node:8.16.1-stretch AS runtime

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
    git && \
    rm -rf /var/lib/apt/lists/*

ADD ./front-end/package.json /usr/src/
# ADD ./front-end/package-lock.json /usr/src/

RUN npm install 

ADD ./front-end /usr/src

CMD ["npm", "run", "start"]
