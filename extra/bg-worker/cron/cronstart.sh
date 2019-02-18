#!/bin/bash

touch siker.txt
node /nodefiles/listener.js
crond && tail -f /dev/null