FROM --platform=linux/amd64 node:22.15.0 AS builder
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV COREPACK_INTEGRITY_KEYS=0
RUN corepack enable
RUN corepack prepare pnpm@latest-9 --activate

WORKDIR /home/node

RUN apk --no-cache add build-base python3

COPY package.json .
COPY pnpm-lock.yaml .

RUN pnpm install

COPY . .

RUN pnpm build

FROM --platform=linux/amd64 node:22.15.0
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV COREPACK_INTEGRITY_KEYS=0
RUN corepack enable
RUN corepack prepare pnpm@latest-9 --activate

WORKDIR /home/node

ENV NODE_ENV=production

COPY package.json .
COPY pnpm-lock.yaml .

RUN apk --no-cache add --virtual builds-deps build-base python3
RUN pnpm install -P
RUN pnpm store prune
RUN apk del builds-deps
RUN rm -rf /var/cache/apk/* /root/.cache /tmp/*

COPY --from=builder /home/node/dist ./dist

COPY tsconfig.migration.json .

EXPOSE 8000

CMD ["pnpm", "start"]
