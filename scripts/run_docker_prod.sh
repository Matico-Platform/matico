#!/bin/bash

(cd matico_admin &&  pm2 start yarn --name admin -- start)
