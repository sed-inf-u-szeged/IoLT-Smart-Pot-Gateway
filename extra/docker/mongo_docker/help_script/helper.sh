#!/usr/bin/env bash

echo 'Creating application user and db'

mongo SZBK-felhasznalok \
        --host localhost \
        --port 27017 \
        --eval "db.createCollection('Felhasznalok');"