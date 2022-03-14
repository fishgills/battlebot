FROM node:16-alpine as ts-compiler

WORKDIR /tmp

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

ARG PORT
ENV PORT $PORT

ARG DB_HOST
ENV DB_HOST $DB_HOST

ARG DB_PASSWORD
ENV DB_PASSWORD $DB_PASSWORD

COPY . /tmp/
RUN yarn install --frozen-lockfile
RUN yarn build

FROM node:16-alpine as ts-remove
WORKDIR /tmp
COPY --from=ts-compiler /tmp/package*.json ./
RUN yarn install --frozen-lockfile --production

FROM node:16-alpine

ARG SHA1

LABEL com.datadoghq.tags.env=production
LABEL com.datadoghq.tags.service=bot
LABEL com.datadoghq.tags.version=$SHA1

WORKDIR /tmp

RUN apk add --update curl

COPY --from=ts-compiler /tmp/dist/ .
COPY --from=ts-compiler /tmp/package.json ./
COPY --from=ts-remove /tmp/node_modules ./node_modules
COPY --from=ts-compiler /tmp/docker-entrypoint.sh ./
RUN ls -al
RUN chmod +rwx /tmp/docker-entrypoint.sh
HEALTHCHECK CMD curl -f http://localhost:4000/.well-known/apollo/server-health || exit 1

EXPOSE $PORT
ENTRYPOINT ["/tmp/docker-entrypoint.sh"]
