FROM ghcr.io/sagernet/sing-box:v1.12.21 AS singbox

# ---------- 1 Base image ----------
FROM node:20-alpine AS base

RUN apk add --no-cache libc6-compat
RUN apk add --no-cache openssl
RUN apk add --no-cache iptables

WORKDIR /app

# ---------- 2 Dependencies ----------
FROM base AS deps

COPY package.json package-lock.json* ./
RUN npm ci

# ---------- 3 Build ----------
FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production
ENV NODE_OPTIONS=--max-old-space-size=2048

ARG NEXT_PUBLIC_SINGBOX_CERTS_DIR
ENV NEXT_PUBLIC_SINGBOX_CERTS_DIR=$NEXT_PUBLIC_SINGBOX_CERTS_DIR


RUN rm -rf .worker-dist \
  && npm run build:worker \
  && test -f .worker-dist/worker/main.js \
  && find .worker-dist -type f | sort

RUN npm run build

# ---------- 4 Production runtime ----------
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN apk add --no-cache libc6-compat
RUN apk add --no-cache openssl
RUN apk add --no-cache docker-cli
RUN apk add --no-cache iproute2

COPY --from=singbox /usr/local/bin/sing-box /usr/local/bin/sing-box

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["node", "server.js"]

# ---------- 5 Worker runtime ----------
FROM node:20-alpine AS worker-runner

WORKDIR /app

ENV NODE_ENV=production

RUN apk add --no-cache libc6-compat
RUN apk add --no-cache openssl

COPY --from=builder /app/.worker-dist ./.worker-dist
COPY --from=deps /app/node_modules ./node_modules

CMD ["node", ".worker-dist/worker/main.js"]
