FROM node:16-alpine as ts-compiler

WORKDIR /usr/src/app

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

ARG GRAPHQL_ENDPOINT
ENV GRAPHQL_ENDPOINT $GRAPHQL_ENDPOINT

ARG PORT
ENV PORT $PORT

ARG CI
ENV CI $CI

COPY . /usr/src/app
RUN yarn install --frozen-lockfile


RUN yarn build

FROM node:16-alpine as ts-remove
ARG CI
ENV CI $CI
WORKDIR /usr/src/app
COPY --from=ts-compiler /usr/src/app/package*.json ./
# COPY --from=ts-compiler /usr/src/app/prepare.js ./

RUN yarn install --production

FROM node:16-alpine
RUN apk add --update curl

ARG SHA1

LABEL com.datadoghq.tags.env=production
LABEL com.datadoghq.tags.service=bot
LABEL com.datadoghq.tags.version=$SHA1

WORKDIR /usr/src/app
COPY --from=ts-compiler /usr/src/app/dist/ .
COPY --from=ts-compiler /usr/src/app/package.json .
COPY --from=ts-remove /usr/src/app/node_modules ./node_modules
ENV PORT 3000
EXPOSE $PORT
HEALTHCHECK CMD curl -f http://localhost:3000/health-check || exit 1
CMD [ "node", "index.js" ]
