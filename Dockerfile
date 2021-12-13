FROM node:16-alpine as ts-compiler

WORKDIR /usr/src/app

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

ARG PORT
ENV PORT $PORT

ARG DB_HOST
ENV DB_HOST $DB_HOST

ARG DB_PASSWORD
ENV DB_PASSWORD $DB_PASSWORD

COPY . /usr/src/app
RUN npm ci

RUN npm run build

FROM node:16-alpine as ts-remove
WORKDIR /usr/src/app
COPY --from=ts-compiler /usr/src/app/package*.json ./
RUN npm ci --only=production

FROM node:16-alpine
WORKDIR /usr/src/app
COPY --from=ts-compiler /usr/src/app/dist ./
COPY --from=ts-compiler /usr/src/app/package.json ./
COPY --from=ts-remove /usr/src/app/node_modules ./node_modules
ENV PORT 4000
EXPOSE $PORT
CMD [ "npm", "run", "start:prod" ]
