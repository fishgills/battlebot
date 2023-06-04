FROM public.ecr.aws/docker/library/node:lts-alpine as builder
ARG APP

WORKDIR /app

COPY package.json .
COPY yarn.lock .
COPY ./packages/$APP/package.json packages/$APP/
RUN yarn install
COPY ./packages/$APP packages/$APP

WORKDIR /app/packages/$APP
RUN yarn build

FROM public.ecr.aws/docker/library/node:lts-alpine as runner
ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

ARG PORT
ENV PORT $PORT

ARG DB_HOST
ENV DB_HOST $DB_HOST

ARG DB_PASSWORD
ENV DB_PASSWORD $DB_PASSWORD
ARG APP
ENV APP $APP

ARG SHA1
ENV SHA1 $SHA1

LABEL com.datadoghq.tags.env=production
LABEL com.datadoghq.tags.service=$APP
LABEL com.datadoghq.tags.version=$SHA1

WORKDIR /app

COPY --from=builder /app/yarn.lock /app/yarn.lock
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/packages/$APP/package.json /app/packages/$APP/package.json

COPY --from=builder /app/packages/$APP/docker-entrypoint.sh /app/packages/$APP/
RUN chmod +x /app/packages/$APP/docker-entrypoint.sh

COPY --from=builder /app/packages/$APP/dist/ /app/packages/$APP/

WORKDIR /app/packages/$APP/
RUN yarn install --prod
RUN apk add curl 

EXPOSE $PORT
HEALTHCHECK CMD curl -f http://localhost:${PORT}/health || exit 1
ENTRYPOINT /app/packages/$APP/docker-entrypoint.sh
