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
RUN pnpm --filter @process-flow/backend deploy --prod /prod/backend

FROM base AS backend
COPY --from=build /prod/backend /app
WORKDIR /app
CMD ["node", "dist/main"]
