FROM node:16-alpine

WORKDIR /usr/src/app

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

COPY package*.json /usr/src/app/
RUN npm ci

COPY . /usr/src/app
RUN npm run build

ENV PORT 4000
EXPOSE $PORT
CMD [ "npm", "run", "start:prod" ]
