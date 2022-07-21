# Install dependencies only when needed
FROM node:16-alpine AS deps
ARG PACKAGE
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
COPY ./packages/web/package.json /app/packages/web/
RUN yarn


# Rebuild the source code only when needed
FROM node:16-alpine AS builder
ARG PACKAGE

WORKDIR /app/

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages/web/node_modules ./packages/web/node_modules
COPY ./packages/web/ ./packages/web/

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED 1
WORKDIR /app/packages/web/
RUN yarn build
RUN ls -al /app/packages/web/.next/standalone

# If using npm comment out above and use below instead
# RUN npm run build

# Production image, copy all the files and run next
FROM node:16-alpine AS runner
ARG PACKAGE
ARG PORT
WORKDIR /app/

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED 1

# RUN addgroup --system --gid 1001 nodejs
# RUN adduser --system --uid 1001 nextjs

# You only need to copy next.config.js if you are NOT using the default configuration
# COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/packages/web/public /app/packages/web/public
COPY --from=builder /app/packages/web/package.json /app/packages/web/package.json
RUN ls -al packages/web/
# Automatically leverage output traces to reduce image size 
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder /app/packages/web/.next/standalone /app/packages/web/
COPY --from=builder /app/packages/web/.next/static /app/packages/web/.next/static
RUN ls -al packages/web/
# USER nextjs

EXPOSE $PORT
ENV PORT=$PORT

CMD ["node", "packages/web/server.js"]