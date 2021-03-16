FROM node:10.14.2-alpine as frontend-builder

ADD ./simple-map-viewer/ /app
WORKDIR /app 
RUN yarn 
RUN yarn build


FROM osgeo/gdal:ubuntu-small-3.0.4 as rust-builder
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs -o install_rust.sh 
RUN sh install_rust.sh -y
ENV PATH="/root/.cargo/bin/:${PATH}"

RUN apt-get update
# RUN apt-get -y install software-properties-common
# RUN add-apt-repository ppa:nextgis/ppa && apt-get update
RUN apt-get -y  install libpq-dev build-essential pkg-config openssl libssl-dev 
# RUN apk --no-cache add g++ make libressl-dev pkgconfig

RUN USER=root cargo new --bin simple_map_server 
WORKDIR ./simple_map_server
ADD . ./

RUN cargo build --release


FROM osgeo/gdal:ubuntu-small-3.0.4

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

COPY --from=rust-builder /simple_map_server/target/release/modest_map_maker ${APP}/modest_map_maker
COPY --from=frontend-builder /app/build ${APP}/static
WORKDIR ${APP}
CMD ./modest_map_maker