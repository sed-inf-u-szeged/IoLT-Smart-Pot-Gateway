#!/bin/bash

touch siker.txt
./startlistening.sh
crond && tail -f /dev/null