FROM --platform=$BUILDPLATFORM node:alpine as base

FROM --platform=$BUILDPLATFORM base as deps

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


FROM --platform=$BUILDPLATFORM base as runner
ARG PORT
ENV PORT $PORT

WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/packages/web/dist /app/dist

EXPOSE $PORT

CMD ["node", "dist/web/server/main.js"]