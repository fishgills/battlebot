# FROM public.ecr.aws/docker/library/node:16-alpine as ts-compiler

# WORKDIR /home/node/app

# ARG NODE_ENV
# ENV NODE_ENV $NODE_ENV

# ARG PORT
# ENV PORT $PORT

# ARG DB_HOST
# ENV DB_HOST $DB_HOST

# ARG DB_PASSWORD
# ENV DB_PASSWORD $DB_PASSWORD

# COPY packages/backend/. /home/node/app/
# RUN yarn install --frozen-lockfile
# RUN yarn build

# FROM public.ecr.aws/docker/library/node:16-alpine as ts-remove
# WORKDIR /home/node/app
# COPY --from=ts-compiler /home/node/app/package*.json ./
# RUN yarn install --frozen-lockfile --production

# FROM public.ecr.aws/docker/library/node:16-alpine

# ARG SHA1

# LABEL com.datadoghq.tags.env=production
# LABEL com.datadoghq.tags.service=bot
# LABEL com.datadoghq.tags.version=$SHA1

# WORKDIR /home/node/app

# RUN apk add --update curl

# COPY --from=ts-compiler /home/node/app/dist/ .
# COPY --from=ts-compiler /home/node/app/package.json ./
# COPY --from=ts-remove /home/node/app/node_modules ./node_modules
# COPY --from=ts-compiler /home/node/app/docker-entrypoint.sh ./
# RUN ls -al
# RUN chmod +rwx /home/node/app/docker-entrypoint.sh
# HEALTHCHECK CMD curl -f http://localhost:4000/.well-known/apollo/server-health || exit 1

# EXPOSE $PORT
# ENTRYPOINT ["/home/node/app/docker-entrypoint.sh"]

FROM public.ecr.aws/docker/library/node:lts-alpine as builder

WORKDIR /app

COPY ./packages/backend/ /app
RUN yarn install
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

WORKDIR /app

COPY --from=builder /app/dist/ .
COPY --from=builder /app/yarn.lock /app/yarn.lock
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/docker-entrypoint.sh ./
RUN chmod +x /app/docker-entrypoint.sh
RUN yarn install --prod
# HEALTHCHECK CMD curl -f http://localhost:$PORT/.well-known/apollo/server-health || exit 1
ENTRYPOINT ["./docker-entrypoint.sh"]
