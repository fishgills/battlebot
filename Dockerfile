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
RUN npm ci

RUN npm run build

FROM node:16-alpine as ts-remove
WORKDIR /tmp
COPY --from=ts-compiler /tmp/package*.json ./
RUN npm ci --only=production

FROM node:16-alpine
WORKDIR /tmp
COPY --from=ts-compiler /tmp/dist ./dist/
COPY --from=ts-compiler /tmp/package.json ./
COPY --from=ts-remove /tmp/node_modules ./node_modules
COPY --from=ts-compiler /tmp/docker-entrypoint.sh ./
RUN chmod +rwx /tmp/docker-entrypoint.sh

EXPOSE $PORT
ENTRYPOINT ["/tmp/docker-entrypoint.sh"]
