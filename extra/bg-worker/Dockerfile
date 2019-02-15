FROM mhart/alpine-node:latest

RUN apk add bash && apk add nano

ENV NODE_PATH /usr/lib/node_modules

RUN npm install -g mongodb && npm install -g mqtt && npm install -g mongoose

RUN /bin/bash -c "mkdir nodefiles" && /bin/bash -c "mkdir cron"

COPY ./project-management/start_projects.js ./project-management/end_projects.js ./project-management/listener.js /nodefiles/

COPY ./cron/checkscript.sh /cron/

RUN touch /valami.txt

RUN chmod +x /cron && chmod +x /cron/checkscript.sh

RUN crontab -l | { cat; echo "*       *       *       *       *       /cron/checkscript.sh\n"; } | crontab -