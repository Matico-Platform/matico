#!/bin/sh
rm -r pkg 
wasm-pack build --target web --scope maticoapp
rm -r ../../matico_server/static/compute/synthetic_data
cp -r pkg ../../matico_server/static/compute/synthetic_data

