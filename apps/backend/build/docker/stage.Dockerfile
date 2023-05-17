FROM node:18 As build

RUN apt-get update \
    && apt-get install -y python3 \
    && apt-get install -y gcc 
RUN npm install -g node-gyp

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build:backend

FROM node:18

WORKDIR /app

COPY --from=build /app/dist ./dist

COPY /*.json ./

RUN npm install


CMD ["npm", "run", "start:backend:prod"]