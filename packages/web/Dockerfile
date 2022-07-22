FROM public.ecr.aws/docker/library/public.ecr.aws/docker/library/node:16-alpine AS deps
ARG PACKAGE
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
COPY ./packages/web/package.json /app/packages/web/
RUN yarn


FROM public.ecr.aws/docker/library/public.ecr.aws/docker/library/node:16-alpine AS builder
ARG PACKAGE

WORKDIR /app/

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages/web/node_modules ./packages/web/node_modules
COPY ./packages/web/ ./packages/web/


WORKDIR /app/packages/web/
RUN yarn build
RUN ls -al /app/packages/web/.next/standalone 


FROM public.ecr.aws/docker/library/node:16-alpine AS runner
ARG PACKAGE
ARG PORT
ARG SHA1

LABEL com.datadoghq.tags.env=production
LABEL com.datadoghq.tags.service=web
LABEL com.datadoghq.tags.version=$SHA1

WORKDIR /app/

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1


COPY --from=builder /app/packages/web/next.config.js /app/packages/web/
COPY --from=builder /app/packages/web/public /app/packages/web/public
COPY --from=builder /app/packages/web/package.json /app/packages/web/package.json

COPY --from=builder /app/packages/web/.next/standalone /app/packages/web/
COPY --from=builder /app/packages/web/.next/static /app/packages/web/.next/static


EXPOSE $PORT
ENV PORT=$PORT

CMD ["node", "packages/web/server.js"]