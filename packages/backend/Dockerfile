FROM docker.io/node:lts-alpine

ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV}
ARG PORT
ENV PORT=${PORT}

ARG DB_HOST
ENV DB_HOST=${DB_HOST}

ARG DB_PASSWORD
ENV DB_PASSWORD=${DB_PASSWORD}

ARG SHA1
ENV SHA1=${SHA1}

LABEL com.datadoghq.tags.env=production
LABEL com.datadoghq.tags.service=backend
LABEL com.datadoghq.tags.version=$SHA1
ENV HOST=0.0.0.0

WORKDIR /app

COPY dist/packages/backend backend/

# You can remove this install step if you build with `--bundle` option.
# The bundled output will include external dependencies.
RUN npm --prefix backend --omit=dev -f install

CMD [ "node", "backend" ]

# FROM public.ecr.aws/docker/library/node:lts-alpine
# ARG NODE_ENV
# ENV NODE_ENV=${NODE_ENV}
# ARG PORT
# ENV PORT=${PORT}

# ARG DB_HOST
# ENV DB_HOST=${DB_HOST}

# ARG DB_PASSWORD
# ENV DB_PASSWORD=${DB_PASSWORD}

# ARG SHA1
# ENV SHA1=${SHA1}

# LABEL com.datadoghq.tags.env=production
# LABEL com.datadoghq.tags.service=backend
# LABEL com.datadoghq.tags.version=$SHA1

# WORKDIR /app

# COPY --from=builder /app/yarn.lock /app/yarn.lock
# COPY --from=builder /app/package.json ./package.json
# COPY --from=builder /app/packages/$APP/package.json /app/packages/$APP/package.json

# COPY --from=builder /app/packages/$APP/docker-entrypoint.sh /app/packages/$APP/
# RUN chmod +x /app/packages/$APP/docker-entrypoint.sh

# COPY --from=builder /app/packages/$APP/dist/ /app/packages/$APP/
# COPY .yarnrc.yml .

# RUN corepack enable
# COPY .yarn/releases/ .yarn/releases/
# COPY yarn.lock .
# RUN yarn install && yarn cache clean
# RUN apk add curl 

# EXPOSE $PORT
# HEALTHCHECK CMD curl -f http://localhost:${PORT}/health || exit 1
# ENTRYPOINT ["/app/packages/$APP/docker-entrypoint.sh"]
