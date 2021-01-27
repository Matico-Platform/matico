FROM node:10.14.2-alpine as frontend-builder

ADD ./simple-map-viewer/ /app
WORKDIR /app 
RUN yarn 
RUN yarn build


FROM osgeo/gdal as rust-builder

RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs -o install_rust.sh 
RUN sh install_rust.sh -y
ENV PATH="/root/.cargo/bin/:${PATH}"

# RUN apt-get update
# RUN apt-get -y install software-properties-common
# RUN add-apt-repository ppa:nextgis/ppa && apt-get update
# RUN apt-get -y install pkg-config openssl libssl-dev gdal-bin
RUN apt-get update && apt install -y build-essential libssl-dev pkg-config

RUN USER=root cargo new --bin simple_map_server 
WORKDIR ./simple_map_server
COPY ./Cargo.toml ./Cargo.toml
RUN cargo build --release
RUN rm src/*.rs

ADD . ./

RUN rm ./target/release/deps/rust_docker_web*
RUN cargo build --release


FROM debian:buster-slim


RUN apt-get update
RUN apt-get -y install software-properties-common
RUN add-apt-repository ppa:ubuntugis/ppa
RUN apt-get update
RUN apt-get -y install gdal-bin

ARG APP=/usr/src/app
RUN apt-get update \
    && apt-get install -y ca-certificates tzdata \
    && rm -rf /var/lib/apt/lists/*

EXPOSE 8000

ENV TZ=Etc/UTC \
    APP_USER=appuser

RUN groupadd $APP_USER \
    && useradd -g $APP_USER $APP_USER \
    && mkdir -p ${APP}

COPY --from=rust-builder /simple_map_server/target/release/rust-builder ${APP}/simple_map_server
COPY --from=frontend-builder /app/build ${APP}/simple_map_server/static