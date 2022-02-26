# Matico Server 

This is the API server for Matico. It is responsible for managing the storage, access, processing and querying of datasets in Matico along with user account management. 

The server is written in rust using the actix-web framework

## Setup

First thing to do is install rust, you can do this by following the instructions [here](https://www.rust-lang.org/tools/install). 

Once that is done you can run the server by simply running 

```bash
cargo run
```

from the command line. This will launch the server at the address http://localhost:8000. You can check that the API is running by navigating to http://localhost:8000/api/health

## Config 

Configuration of the API server is accomplished using a .env file. The minimum setup is to specify a metadata database, a data database and an optional testing database.

You also need to include the SERVER\_ADDR variable to let the server know what port to load on. 

An example .env file looks like 

```
DB.HOST=localhost
DB.PORT=5432
DB.USERNAME=matico
DB.NAME=matico_meta_db

DATADB.HOST=localhost
DATADB.PORT=5432
DATADB.USERNAME=matico
DATADB.NAME=matic_data_db

TESTDB.HOST=localhost
TESTDB.PORT= 5432
TESTDB.USERNAME=matico
TESTDB.NAME=matico_test_meta_db

TESTDATADB.HOST=localhost
TESTDATADB.PORT= 5432
TESTDATADB.USERNAME=matico
TESTDATADB.NAME=matico_test_data_db

SERVER_ADDR=0.0.0.0:8000
```

The server expects the metadata db to simple exist, it should run all pending migrations for the server on startup.

The data\_db and the testing data\_db require a database to be setup with the [postgis extension](https://postgis.net/install/) installed.

## Testing 

If you have setup the required testing databases, you can run the server tests simple by running.

```
cargo test
```

This will also produce Typescript types derived from rust structs required for working with the API 


## Api documentation 

API docs can be found at http://localhost:8000/docs 

## Orginization 


