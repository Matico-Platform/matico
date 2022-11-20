# Matico 

Matico is a set of tools and services that allow users to manage geospatial datasets, build APIs that use those datasets and full geospatial applications with little to no code. 

It is built as a set of loosely coupled packages, that can be consumed individually or all together depending om what you want to do with them.

The app builder can be run without the server as a standalone application that produces the MaticoSpec used to describe an application or can be used with the server to host those applications and get access to persisted datasets and APIS.

## Project layout 

The project is setup as a monorepo with the following workspaces

- matico\_spec : A Rust based library that defines the MaticoApplication specification that is used to build applications. This can be consumed by other languages such as javascript and python to build applications in those environments
- matico\_charts : A Typescript component library which wraps visx and provides various different chart components for use in Matico
- matico\_admin: The frontend interface that allows users to upload, manage and access geospatial datasets and to build APIS and Apps from those datasets.
- matico\_components: The code component library for building Matico Apps, can be used all together or you can grab specific components from the library 
- matico\_sever: The backend server that provides the API that matico\_admin consumes. 

- editor : A minimal implementation of an application that allows users to create MaticoApps 

Details on each of these components can be found at [https://matico.app/docs](https://matico.app/docs)

## Running the full environment locally 

You have two choices when running the Matico environment locally. You can either use our dockerized solution or you can run each of the components individually. 
If you are going to install locally, you need to use node version `v16.6.1`.

### Docker 

To run the system in docker, simply 

1. install docker
2. install docker-compose 
3. run ```docker-compose up`` from the command line 

This will create a database and start the MaticoServer and MaticoAdmin interfaces 

Once you are done simply halt the docker-compose process to shutdown the server 

### Running individually

To fully run the app individually you can do the following 

```bash

(cd matico_spec; cargo build; wasm-pack build --scope maticoapp)

// In a separate terminal or tmux pane 

(cd matico_charts; yarn build)

// In a separate terminal or tmux pane 

(cd matico_components; yarn build-dev)

// In a separate terminal or tmux pane 

(cd matico_admin; yarn dev)

// In a separate terminal or tmux pane 

(cd matico_server; cargo run)
```

We are working on ways of making this process smoother just now. 

## Deploying the app to production 

To deploy the application to production, you have a few options

1. If deploying to render, we provide a template [render.yaml](/render.yaml) file which will provision and set up the necessary resources on that system 
2. Build the docker image locally, push it up to a docker repository and setup your hosting environment to use that image 
3. Roll your own deploy.

We are dedicated to making Matico as easy to deploy as possible and so in addition to render we are looking to include other infrastructure as code setups for various environments such as AWS, AZURE etc.

If you would like to help contribute a setup, open up a PR.



