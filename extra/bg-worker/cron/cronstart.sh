#!/bin/bash

crond
/cron/startlistening.sh
tail -f /dev/null