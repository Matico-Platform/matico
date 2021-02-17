# Modest Map Maker

This repo contains an API server and a front end that should make it easy to manage and build geospatial applications.

It is a big work in progress

The server is written in rust using actix-web, front end is in react and typescript.

## Setup

You will need a postgis database somewhere, either a docker container or something running locally.

Update the settings in Settings.toml and in .env to reflect the database location (consolidating these soon). 

Then we need to run the migrations for the database. 

install rust then install diesel_cli

```bash
cargo install diesel_cli
diesel migration run 
```

install the frontend dependencies 

```bash
cd simple-map-viewer
yarn 
```

Start the frontend server 

```bash
yarn start 
```

Start the api server 

```
cargo run 
```

You will need to create a new user to upload datasets. Do so at /login 

## notable endpoints 

To upload a dataset make a multipart post request with a valid JWT token to /datasets 

To get the MVT tiles for a dataset you need /tiler/:datasetid/z/x/y
To get data from the table you can use /datasets/:datasetid/query

More details in the /simple-map-viewer/src/api.ts file.

