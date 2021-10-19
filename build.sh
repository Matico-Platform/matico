#!/bin/bash

yarn set version berry
yarn
yarn install 
(cd matico_spec && wasm-pack build --release)
yarn workspace matico_components build 
yarn workspace editor build

