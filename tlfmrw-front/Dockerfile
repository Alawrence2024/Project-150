FROM node:20 AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
ENV REDIS_URL="redis://localhost:6379"
RUN npm run build

FROM node:20-slim AS runner
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED 1

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
