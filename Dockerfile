
# For building the server and the spec
#----------------------------------------------------------------------------------
FROM osgeo/gdal:ubuntu-small-3.4.1 as rust-builder
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs -o install_rust.sh 
RUN sh install_rust.sh -y
ENV PATH="/root/.cargo/bin/:${PATH}"

RUN rustup default nightly
RUN apt-get update
# RUN apt-get -y install software-properties-common
# RUN add-apt-repository ppa:nextgis/ppa && apt-get update
RUN apt-get -y install libpq-dev build-essential pkg-config openssl libssl-dev libclang-dev 
# RUN apk --no-cache add g++ make libressl-dev pkgconfig

RUN curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh

RUN mkdir /app
ADD ./Cargo.toml ./Cargo.toml /app/
ADD ./matico_spec /app/matico_spec
ADD ./matico_spec_derive /app/matico_spec_derive
ADD ./matico_server /app/matico_server
ADD ./matico_common /app/matico_common
ADD ./matico_compute /app/matico_compute
ADD ./matico_types/package.json /app/matico_types/package.json
ADD ./matico_types/index.d.ts /app/matico_types/index.d.ts
ADD ./scripts /app/scripts

RUN ls /app/scripts
WORKDIR /app 
RUN cargo build --release

WORKDIR /app/matico_spec
RUN wasm-pack build  --release --scope maticoapp

RUN mkdir -p /app/matico_server/static/compute/

WORKDIR /app/matico_compute/matico_hdbscam_analysis
RUN ./build.sh
WORKDIR /app/matico_compute/matico_dot_density_analysis
RUN ./build.sh

WORKDIR /app
RUN ls 
RUN pwd
RUN ./scripts/build_types.sh

# Install the dependencies for javascript
#--------------------------------------------------------------------------------

FROM node:16.6.1-alpine3.13 as javascript_deps
ENV NODE_ENV production
RUN apk --no-cache add shadow \                                                                   
    gcc \                                                                                         
    musl-dev \                                                                                    
    autoconf \                                                                                    
    automake \                                                                                    
    make \                                                                                        
    libtool \                                                                                     
    nasm \                                                                                        
    tiff \                                                                                        
    jpeg \                                                                                        
    zlib \                                                                                        
    zlib-dev \                                                                                    
    file \                                                                                        
    pkgconf \                                                                                     
    libc6-compat


WORKDIR /app
COPY .yarn ./.yarn
COPY .yarnrc.yml ./
COPY yarn.lock ./yarn.lock
COPY package.json ./
COPY matico_components/package.json ./matico_components/package.json
COPY matico_admin/package.json ./matico_admin/package.json
COPY matico_charts/package.json ./matico_charts/package.json
COPY --from=rust-builder /app/matico_spec/pkg /app/matico_spec/pkg
COPY --from=rust-builder /app/matico_types /app/matico_types
RUN ls /app/matico_types/
RUN yarn
RUN ls -alh .

# For building the components lib and the nextjs app
#--------------------------------------------------------------------------------

FROM node:16.6.1-alpine3.13 as frontend-builder

COPY --from=javascript_deps /app /app
WORKDIR /app/
# # COPY --from=javascript_deps /app/.yarn ./.yarn 
# # COPY --from=javascript_deps /app/yarn.lock ./yarn.lock
# # COPY --from=javascript_deps /app/.yarnrc.yml ./.yarnrc.yml
# # COPY --from=javascript_deps /app/.pnp.cjs ./.pnp.cjs
# # COPY --from=javascript_deps /app/package.json ./package.json
COPY --from=rust-builder /app/matico_spec/pkg /app/matico_spec/pkg
ADD matico_components /app/matico_components
ADD matico_admin /app/matico_admin
ADD matico_charts /app/matico_charts
# # ADD package.json /app/package.json
# # ADD yarn.lock /app/yarn.lock
# # ADD .yarnrc.yml /app/.yarnrc.lock
# # ADD .yarn /app/.yarn

# ADD matico_components ./matico_components 
# ADD matico_admin ./matico_admin
# RUN yarn
RUN yarn workspace @maticoapp/matico_charts run build
RUN yarn workspace @maticoapp/matico_components run build-prod
ENV NEXT_PUBLIC_SERVER_URL="/api" 
RUN yarn workspace matico_admin run build
RUN ls -alh /app/matico_admin/.next

# For running everything 
#--------------------------------------------------------------------------------

FROM osgeo/gdal:ubuntu-small-3.4.1

ENV NODE_ENV production

ARG APP=/usr/src/app
RUN apt-get update \
    && apt-get install -y ca-certificates tzdata nginx systemd \
    && rm -rf /var/lib/apt/lists/*

RUN curl -sL https://deb.nodesource.com/setup_16.x | bash - \
    && apt-get install -y nodejs

RUN npm install pm2 yarn --global
# RUN addgroup -g 1001 -S nodejs
# RUN adduser -S nextjs -u 1001

EXPOSE 8000

ENV TZ=Etc/UTC \
    APP_USER=appuser

RUN groupadd $APP_USER \
    && useradd -g $APP_USER $APP_USER \
    && mkdir -p ${APP}

COPY --from=frontend-builder /app/ ${APP}/
COPY --from=rust-builder /app/target/release/matico_server ${APP}/matico_server
# RUN rm -rf ${APP}/matico_admin/next.config.js

# COPY --from=frontend-builder /app/matico_admin/.next/static ${APP}/_next/static
# COPY --from=frontend-builder /app/matico_admin/.next/standalone ${APP}/matico_admin/
# COPY --from=frontend-builder /app/matico_admin/public ${APP}/matico_admin/public

WORKDIR ${APP}/matico_admin
# RUN rm package.json
# RUN npm init -y 
# RUN npm install next 

WORKDIR ${APP}

# USER nextjs

EXPOSE 8888 

ADD scripts/run_docker_prod.sh ./
ADD scripts/nginx.conf /etc/nginx/nginx.conf

CMD ["/bin/sh","run_docker_prod.sh"]
