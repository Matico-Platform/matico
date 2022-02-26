# Matico Admin

This project contains the code for the Matico Admin interface. This is estentially a frontend for the MaticoServer API and the App builder. Through it a user can 

- Create an account on the server 
- Login 
- Upload Datasets 
- Manage /Share Datasets
- Modify Datasets 
- Create Apps 
- Create APIS 

see [https://matico.app/docs](https://matico.app/docs) for more details on each of the above.

## Installing dependencies

To install all the required dependencies you can simply run 

```bash
yarn install
```

this will take a few minutes but when it's done you should be good to go.


## Running the admin interface 

First, start the API server as described [here](/matico_server/README.md). Then run 

```bash
yarn build 
yarn start
```

This should start the server at http://localhost:3000

## Running in development 

If you are helping develop the application, you can run the admin interface in development mode by running 

```bash

yarn dev 

```

## Connecting to a remote API server 

By default the admin interface will look for a MaticoServer at localhost:8000 . You can point it at a remote API by creating a .env file within this folder with the following 

```
NEXT_PUBLIC_SERVER_URL=http://my_remote_server_address/api
```


