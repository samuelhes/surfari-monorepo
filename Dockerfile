# Stage 1: Build Frontend
FROM node:20-alpine as frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# Stage 2: Build Backend
FROM node:20-alpine as backend-build
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend/ .
RUN npm run build

# Stage 3: Production Runtime
FROM node:20-alpine
WORKDIR /app

# Copy backend built files
COPY --from=backend-build /app/backend/dist ./dist
COPY --from=backend-build /app/backend/package*.json ./
COPY --from=backend-build /app/backend/node_modules ./node_modules

# Copy frontend built files to a 'public' directory in the backend
COPY --from=frontend-build /app/frontend/dist ./public

# Copy database schema/seeds if needed (or rely on volume)
COPY --from=backend-build /app/backend/src/scripts ./src/scripts

# Install production dependencies only (if not already pruned)
# ENV NODE_ENV=production

EXPOSE 3000

# Start the server
CMD ["node", "dist/index.js"]
