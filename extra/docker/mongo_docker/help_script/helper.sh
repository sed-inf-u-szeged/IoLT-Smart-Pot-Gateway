#!/usr/bin/env bash

echo 'Creating application user and db'

mongo SZBK-felhasznalok \
        --host localhost \
        --port 27017 \
        --eval "db.createCollection('Felhasznalok');"

mongo SZBK-felhasznalok \
        --host localhost \
        --port 27017 \
        --eval "db.Felhasznalok.insertOne({'username': '${DEFAULT_USERNAME}','password': '${DEFAULT_PASSWORD}', 'role': 'admin'})"