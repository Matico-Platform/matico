#!/bin/bash


service nginx start
# (cd matico_admin &&  pm2 start server.js --name admin)
(cd matico_admin && pm2 start yarn --name admin -- start )
./matico_server
