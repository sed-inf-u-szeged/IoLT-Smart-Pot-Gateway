FROM mhart/alpine-node:latest

RUN apk add bash && apk add nano

RUN /bin/bash -c "mkdir nodefiles"

RUN npm install -g mongodb && npm install -g mqtt && npm install -g mongoose

WORKDIR ./project-management

COPY ./project-management/start_projects.js ./project-management/end_projects.js ./project-management/listener.js /nodefiles/