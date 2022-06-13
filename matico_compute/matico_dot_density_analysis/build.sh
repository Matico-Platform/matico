#!/bin/sh
rm -r pkg 
wasm-pack build --target web --scope maticoapp
mv pkg ../../matico_server/static/compute/dot_density_analysis
