FROM node:alpine as base

FROM base as deps

RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json yarn.lock ./
COPY packages/web/package.json packages/web/package.json

RUN yarn

FROM base as builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY packages/web/ /app/packages/web/
COPY --from=deps /app/packages/web/node_modules ./packages/web/node_modules


WORKDIR /app/packages/web

RUN yarn build:ssr


FROM base as runner
ARG PORT
ENV PORT $PORT

WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/packages/web/dist /app/dist
RUN apk add --no-cache curl 

EXPOSE $PORT
HEALTHCHECK CMD curl -f http://localhost:${PORT}/health || exit 1
CMD ["node", "dist/web/server/main.js"]