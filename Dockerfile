# --- STAGE 1: Install Dependencies ---
FROM node:20-slim AS deps
WORKDIR /app

# 👇 WAJIB: Install OpenSSL di sini juga biar aman saat install package
RUN apt-get update -y && apt-get install -y openssl

RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# --- STAGE 2: Build App ---
FROM node:20-slim AS builder
WORKDIR /app

# 👇 WAJIB: Install OpenSSL di sini buat 'npx prisma generate'
RUN apt-get update -y && apt-get install -y openssl

RUN npm install -g pnpm
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npx prisma generate
RUN pnpm build

# --- STAGE 3: Production Runner ---
FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV production

# 👇 WAJIB: Install OpenSSL di sini buat Runtime Aplikasi (saat connect ke DB)
RUN apt-get update -y && apt-get install -y openssl

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000
CMD ["node", "dist/main"]