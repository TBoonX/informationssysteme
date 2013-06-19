#!/usr/local/bin/bash

mongo localhost:27017/work --eval "print(db.temperatures.find().pretty())"
