FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app

# Build stage
FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
# Build common package first
RUN pnpm --filter @process-flow/common build
# Build frontend
RUN pnpm --filter @process-flow/frontend build
# Build backend
RUN pnpm --filter @process-flow/backend build
# Prune dependencies for the backend
RUN pnpm --filter @process-flow/backend deploy --prod /prod/backend --legacy

# Final production stage
FROM node:20-alpine AS production
WORKDIR /app

# Copy the pruned production backend
COPY --from=build /prod/backend /app

# Copy the backend build artifacts (dist)
COPY --from=build /app/apps/backend/dist /app/dist

# Copy the frontend build artifacts (dist) into the backend's public folder
# AppModule is configured to serve from ../../public relative to dist/src/main.js
# So if main.js is in /app/dist/src/main.js, then ../../public is /app/public
COPY --from=build /app/apps/frontend/dist /app/public

# Expose the API port
EXPOSE 8080

# Run the app
CMD ["node", "dist/src/main.js"]
