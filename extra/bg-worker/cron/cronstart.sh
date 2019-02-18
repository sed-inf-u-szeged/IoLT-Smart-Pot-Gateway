#!/bin/bash

setsid /cron/startlistening.sh >/dev/null 2>&1 < /dev/null &
crond && tail -f /dev/null