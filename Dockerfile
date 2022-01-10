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

WORKDIR /app 
RUN ls 
RUN cargo build --release


WORKDIR /app/matico_spec
RUN wasm-pack build  --release

# For building the components lib and the nextjs app
#--------------------------------------------------------------------------------

FROM node:lts-alpine3.15 as frontend-builder

ADD . /app/
# ADD matico_components /app/matico_components
# ADD matico_server /app/matico_server
# ADD package.json /app/package.json
# ADD yarn.lock /app/yarn.lock
# ADD .yarnrc.yml /app/.yarnrc.lock
# ADD .yarn /app/.yarn

COPY --from=rust-builder /app/matico_spec/pkg /app/matico_spec/pkg
WORKDIR /app
RUN sed -i 's/\"matico_spec\"/\"@maticoapp\/matico_spec"/g' matico_spec/pkg/package.json 
RUN ls matico_spec
RUN cat matico_spec/pkg/package.json
RUN yarn 
RUN yarn workspace @maticoapp/matico_components run build-prod
RUN yarn workspace matico_admin run build
RUN ls -alh matico_admin/.next/

# For running everything 
#--------------------------------------------------------------------------------

FROM osgeo/gdal:ubuntu-small-3.4.1

ENV NODE_ENV production

ARG APP=/usr/src/app
RUN apt-get update \
    && apt-get install -y ca-certificates tzdata nodejs nginx npm \
    && rm -rf /var/lib/apt/lists/*

# RUN addgroup -g 1001 -S nodejs
# RUN adduser -S nextjs -u 1001

EXPOSE 8000

ENV TZ=Etc/UTC \
    APP_USER=appuser

RUN groupadd $APP_USER \
    && useradd -g $APP_USER $APP_USER \
    && mkdir -p ${APP}

RUN npm install yarn --global
COPY --from=rust-builder /app/target/release/matico_server ${APP}/matico_server
ADD ./matico_server/.env ${APP}/.env

COPY --from=frontend-builder /app/matico_admin ${APP}/matico_admin
WORKDIR ${APP}/matico_admin
RUN rm package.json package-lock.json
RUN rm -rf  node_modules
RUN yarn init  -y 
RUN yarn add next

# USER nextjs

EXPOSE 3000

ENV PORT 3000

# COPY --from=frontend-builder --chown=nextjs:nodejs /app/matico_admin/.next ${APP}/matico_admin/.next
# COPY --from=frontend-builder /app/matico_admin/node_modules ${APP}/matico_admin/node_modules
# COPY --from=frontend-builder /app/matico_admin/package.json ${APP}/matico_admin/package.json

# COPY static/docs ${APP}/static/docs

CMD ["yarn","run", "next", "start"]
