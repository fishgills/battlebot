FROM node:16-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
COPY ./packages/bot/package.json /app/packages/bot/
RUN yarn


FROM node:16-alpine AS builder

WORKDIR /app/

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages/bot/node_modules ./packages/bot/node_modules
COPY ./packages/bot/ ./packages/bot/


WORKDIR /app/packages/bot/
RUN yarn build

FROM node:16-alpine AS runner

ARG SHA1

LABEL com.datadoghq.tags.env=production
LABEL com.datadoghq.tags.service=bot
LABEL com.datadoghq.tags.version=$SHA1

ARG PORT
WORKDIR /app/

ENV NODE_ENV production

COPY --from=builder /app/packages/bot/dist/ /app/packages/bot/
COPY --from=builder /app/packages/bot/package.json /app/packages/bot/package.json
COPY --from=deps /app/packages/bot/node_modules/ /app/packages/bot/node_modules
COPY --from=deps /app/node_modules /app/node_modules
RUN ls -al /app
RUN ls -al /app/packages/bot
EXPOSE $PORT
ENV PORT=$PORT

CMD ["node", "packages/bot/index.js"]
# FROM node:16-alpine as ts-compiler

# WORKDIR /app

# ARG NODE_ENV
# ENV NODE_ENV $NODE_ENV

# ARG GRAPHQL_ENDPOINT
# ENV GRAPHQL_ENDPOINT $GRAPHQL_ENDPOINT

# ARG PORT
# ENV PORT $PORT

# ARG CI
# ENV CI $CI

# COPY . /app
# RUN yarn install --frozen-lockfile


# RUN yarn build

# FROM node:16-alpine as ts-remove
# ARG CI
# ENV CI $CI
# WORKDIR /app
# COPY --from=ts-compiler /app/package*.json ./
# # COPY --from=ts-compiler /usr/src/app/prepare.js ./

# RUN yarn install --production

# FROM node:16-alpine
# RUN apk add --update curl



# WORKDIR /usr/src/app
# COPY --from=ts-compiler /usr/src/app/dist/ .
# COPY --from=ts-compiler /usr/src/app/package.json .
# COPY --from=ts-remove /usr/src/app/node_modules ./node_modules
# ENV PORT 3000
# EXPOSE $PORT
# HEALTHCHECK CMD curl -f http://localhost:3000/health-check || exit 1
# CMD [ "node", "index.js" ]
