# Fase 1: Instalación de dependencias
FROM node:18-alpine AS deps
WORKDIR /app

# Copiar solo los archivos de manifiesto del paquete
COPY package.json package-lock.json* ./ 

# Usar npm ci para una instalación limpia y reproducible
RUN npm ci

# Fase 2: Construcción de la aplicación
FROM node:18-alpine AS builder
WORKDIR /app

# Copiar dependencias de la fase anterior
COPY --from=deps /app/node_modules ./node_modules

# Copiar el resto del código fuente
COPY . .

# Construir la aplicación Next.js
RUN npm run build

# Fase 3: Producción
FROM node:18-alpine AS runner
WORKDIR /app

# Variables de entorno para producción
ENV NODE_ENV=production

# Copiar los artefactos de construcción de la fase anterior
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Exponer el puerto que Next.js usa por defecto
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]