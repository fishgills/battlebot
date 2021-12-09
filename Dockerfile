FROM node:16-alpine

WORKDIR /usr/src/app

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

ARG PORT
ENV PORT $PORT

ARG DB_HOST
ENV DB_HOST $DB_HOST

ARG DB_PASSWORD
ENV DB_PASSWORD $DB_PASSWORD

COPY package*.json /usr/src/app/
RUN npm ci

COPY . /usr/src/app
RUN npm run build

ENV PORT 4000
EXPOSE $PORT
CMD [ "npm", "run", "start:prod" ]
