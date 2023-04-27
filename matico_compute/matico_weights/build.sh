#!/bin/sh
rm -r pkg 
wasm-pack build --target web --scope maticoapp
rm -rf ../../matico_app_server/public/compute/weights
cp -r pkg ../../matico_app_server/public/compute/weights

