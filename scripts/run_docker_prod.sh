#!/bin/bash


echo DB.HOST=${DB_HOST} >> .env
echo DB.PORT=${DB_PORT} >> .env
echo DB.USERNAME=${DB_USERNAME} >> .env
echo DB.NAME=${DB_NAME} >> .env
echo DB.PASSWORD=${DB_PASSWORD} >> .env

echo DATADB.HOST=${DB_HOST} >> .env
echo DATADB.PORT=${DB_PORT} >> .env
echo DATADB.USERNAME=${DB_USERNAME} >> .env
echo DATADB.NAME=${DB_NAME} >> .env
echo DATADB.PASSWORD=${DB_PASSWORD} >> .env

echo SERVER_ADDR=0.0.0.0:8000 >> .env

service nginx start
# (cd matico_admin &&  pm2 start server.js --name admin)
(cd matico_admin && PORT=3000 pm2 start yarn --name admin -- start )
./matico_server
