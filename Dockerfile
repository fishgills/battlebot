FROM public.ecr.aws/docker/library/node:lts-alpine AS builder
ARG APP

WORKDIR /app

RUN corepack enable
COPY package.json .
COPY package-lock.json .
COPY nx.json .
RUN npm ci
COPY ./packages/$APP packages/$APP

RUN npx nx run $APP:build

FROM public.ecr.aws/docker/library/node:lts-alpine AS runner
ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV}
ARG PORT
ENV PORT=${PORT}

ARG DB_HOST
ENV DB_HOST=$DB_HOST

ARG DB_PASSWORD
ENV DB_PASSWORD=${DB_PASSWORD}
ARG APP
ENV APP=${APP}

ARG SHA1
ENV SHA1=${SHA1}

LABEL com.datadoghq.tags.env=production
LABEL com.datadoghq.tags.service=$APP
LABEL com.datadoghq.tags.version=$SHA1

WORKDIR /app

COPY --from=builder /app/package.json ./package.json

COPY --from=builder /app/packages/$APP/docker-entrypoint.sh /app/packages/$APP/
RUN chmod +x /app/packages/$APP/docker-entrypoint.sh

COPY --from=builder /app/packages/$APP/dist/ /app/packages/$APP/

RUN corepack enable
COPY package.json .
COPY package-lock.json .
RUN npm ci
COPY nx.json .

RUN apk add curl 

EXPOSE $PORT
HEALTHCHECK CMD curl -f http://localhost:${PORT}/health || exit 1
ENTRYPOINT ["/app/packages/$APP/docker-entrypoint.sh"]
