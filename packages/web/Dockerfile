FROM public.ecr.aws/docker/library/node:lts-alpine as builder

WORKDIR /app
COPY ./packages/web/ /app/
RUN yarn install
RUN yarn build

FROM public.ecr.aws/docker/library/node:lts-alpine as runner
ARG PORT
ARG SHA1

ENV NODE_ENV production
ENV PORT=$PORT

LABEL com.datadoghq.tags.env=$NODE_ENV
LABEL com.datadoghq.tags.service=web
LABEL com.datadoghq.tags.version=$SHA1

WORKDIR /app

COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

RUN ls -al /app

EXPOSE $PORT

CMD ["node", "server.js"]

