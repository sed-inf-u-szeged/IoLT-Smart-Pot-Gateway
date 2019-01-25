FROM mhart/alpine-node:latest

WORKDIR /usr/src/app

COPY . .

RUN npm install

RUN apk add --no-cache tzdata

ENV TZ Europe/Budapest

COPY . .

EXPOSE 3000

CMD [ "node", "index.js" ]