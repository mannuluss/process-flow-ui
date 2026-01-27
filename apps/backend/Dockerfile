FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm --filter @process-flow/common build
RUN pnpm --filter @process-flow/backend build
# Use pnpm deploy to create a pruned lockfile and node_modules for production.
# This assumes @process-flow/backend does NOT have a "deploy" script in package.json,
# as we are using the built-in pnpm deploy command.
RUN pnpm --filter @process-flow/backend deploy --prod /prod/backend

FROM base AS backend
# Copy the deployed dependencies and package.json
COPY --from=build /prod/backend /app
# Manually copy the dist folder because pnpm deploy respects .gitignore (which includes dist)
COPY --from=build /app/apps/backend/dist /app/dist
WORKDIR /app
CMD ["node", "dist/main"]
