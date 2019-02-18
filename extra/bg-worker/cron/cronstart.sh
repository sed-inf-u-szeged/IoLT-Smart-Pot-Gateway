#!/bin/bash

touch siker.txt
/cron/startlistening.sh
crond && tail -f /dev/null