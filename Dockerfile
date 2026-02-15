# ---------- 1️⃣ Base image ----------
FROM node:20-alpine AS base

# Для корректной работы некоторых зависимостей
RUN apk add --no-cache libc6-compat

WORKDIR /app

# ---------- 2️⃣ Dependencies ----------
FROM base AS deps

COPY package.json package-lock.json* ./
RUN npm ci

# ---------- 3️⃣ Build ----------
FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production

RUN npm run build

# ---------- 4️⃣ Production runtime ----------
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# создаём non-root пользователя
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# копируем standalone сборку
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# меняем владельца
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
