FROM mhart/alpine-node:latest

RUN apk add bash && apk add nano

RUN /bin/bash -c "mkdir nodefiles"

RUN npm install -g mongodb && npm install -g mqtt && npm install -g mongoose

WORKDIR ./project-management

COPY start_projects.js end_projects.js listener.js /nodefiles/