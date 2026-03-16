# --- Build Stage ---
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies (including peer deps if necessary, though we fixed those)
RUN npm install

# Copy source
COPY . .

# Generate Prisma client and build
RUN npx prisma generate
RUN npm run build

# --- Runtime Stage ---
FROM node:22-alpine

WORKDIR /app

# Install only production dependencies
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install --omit=dev

# Copy build artifacts and prisma client from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client

# Expose backend port
EXPOSE 3001

# Start the application
CMD ["node", "dist/src/main.js"]
