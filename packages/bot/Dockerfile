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
RUN npm ci

RUN npm run build

FROM node:16-alpine as ts-remove
ARG CI
ENV CI $CI
WORKDIR /usr/src/app
COPY --from=ts-compiler /usr/src/app/package*.json ./
COPY --from=ts-compiler /usr/src/app/prepare.js ./

RUN npm ci --only=production

FROM node:16-alpine
WORKDIR /usr/src/app
COPY --from=ts-compiler /usr/src/app/dist ./
COPY --from=ts-compiler /usr/src/app/package.json ./
COPY --from=ts-remove /usr/src/app/node_modules ./node_modules
ENV PORT 3000
EXPOSE $PORT
HEALTHCHECK CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health-check || exit 1
CMD [ "npm", "run", "start:prod" ]
