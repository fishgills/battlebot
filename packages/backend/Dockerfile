FROM node:16-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
COPY ./packages/backend/package.json /app/packages/backend/
RUN yarn


FROM node:16-alpine AS builder

WORKDIR /app/

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages/backend/node_modules ./packages/backend/node_modules
COPY ./packages/backend/ ./packages/backend/


WORKDIR /app/packages/backend/
RUN yarn build

FROM node:16-alpine AS runner

ARG SHA1

LABEL com.datadoghq.tags.env=production
LABEL com.datadoghq.tags.service=backend
LABEL com.datadoghq.tags.version=$SHA1

ARG PORT
WORKDIR /app/

ENV NODE_ENV production

COPY --from=builder /app/packages/backend/dist/ /app/packages/backend/
COPY --from=builder /app/packages/backend/package.json /app/packages/backend/package.json
COPY --from=deps /app/packages/backend/node_modules/ /app/packages/backend/node_modules
COPY --from=deps /app/node_modules /app/node_modules
EXPOSE $PORT
ENV PORT=$PORT
ENTRYPOINT ["/app/docker-entrypoint.sh"]

# FROM node:16-alpine as ts-compiler

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

# FROM node:16-alpine as ts-remove
# WORKDIR /home/node/app
# COPY --from=ts-compiler /home/node/app/package*.json ./
# RUN yarn install --frozen-lockfile --production

# FROM node:16-alpine

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
