# 1) Build stage
FROM node:20-slim AS build
WORKDIR /app
COPY package*.json ./
# Install all dependencies including dev dependencies for building
RUN npm install
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# 2) Production runtime
FROM node:20-slim
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
# Install only production dependencies
RUN npm ci --omit=dev
# Copy built application from build stage
COPY --from=build /app/dist ./dist
# Fly provides $PORT in production; our app listens on it.
ENV PORT=8080
CMD ["node", "dist/index.js"]
