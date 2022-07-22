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
