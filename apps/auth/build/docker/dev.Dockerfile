FROM node:18

RUN apt-get update \
    && apt-get install -y python3 \
    && apt-get install -y gcc \ 
    && apt-get install -y musl \
    && apt-get install glibc-source

RUN npm install -g node-gyp

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "start:auth:dev"]