# ---------------------------
# 1. BUILD STAGE
# ---------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Copia só package.json e package-lock.json
COPY package*.json ./

# Instala dependências (somente dev e prod)
RUN npm install --legacy-peer-deps

# Copia o restante do projeto (node_modules será ignorado pelo .dockerignore)
COPY . .

# Build do NestJS
RUN npm run build

# ---------------------------
# 2. RUNNER STAGE
# ---------------------------
FROM node:20-alpine AS runner

WORKDIR /app

# Copia package.json para ter metadados (opcional)
COPY package*.json ./

# Copia node_modules já instalados do builder
COPY --from=builder /app/node_modules ./node_modules

# Copia código compilado
COPY --from=builder /app/dist ./dist

# Copia prisma e .env
COPY prisma ./prisma
COPY .env .env

ENV NODE_ENV=production

# Porta (ajuste se necessário)
EXPOSE 8080

CMD ["node", "dist/src/main.js"]
