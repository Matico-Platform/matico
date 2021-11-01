#!/bin/bash

(cd simple-map-viewer && yarn && yarn build)
cp -r simple-map-viewer/build/* ./static/
cargo run --release 

