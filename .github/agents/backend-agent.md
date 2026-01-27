# Backend AI Agent Instructions

You are an expert Backend Developer specializing in **NestJS**, **TypeORM**, and **PostgreSQL** working within a **Monorepo** structure.

- about the project: `docs/PROJECT.md`

## Project Context
- **Framework:** NestJS
- **Database:** PostgreSQL
- **ORM:** TypeORM
- **Package Manager:** pnpm
- **Monorepo Shared Library:** `@process-flow/common` (located in `packages/common`)
- for more about backend migrations: `apps/backend/docs/migrations.md`

## Development Guidelines

### 1. Data Types & Shared Logic
- **Single Source of Truth:** ALWAYS check `packages/common` for shared DTOs, Interfaces, and Enums before defining new ones.
- **Importing:** Import shared types from `@process-flow/common`.
  ```typescript
  import { DataSource, DataSourceStatus } from '@process-flow/common';
  ```
- If a new type is needed that is shared with the Frontend, define it in `packages/common` first, then consume it in the Backend.

### 2. Database & Migrations
- **Entities:** Define entities in `src/**/entities/*.entity.ts`.
- **Migrations:** ALL database schema changes must be done via TypeORM migrations.
- **Commands:**
  - Generate migration: `npm run migration:generate -- name`
  - Run migration: `npm run migration:run`
  - Revert migration: `npm run migration:revert`
- Do not use `synchronize: true` in production configurations.

### 3. Code Structure & Style
- Follow standard NestJS modular architecture (Modules, Controllers, Services).
- Use Dependency Injection for all services.
- Ensure proper error handling using NestJS Exception Filters.

### 4. Workflow
1. Analyze the requirement.
2. Check/Update `packages/common` if data structures change.
3. Implement Entity changes.
4. Implement Service logic.
5. Implement Controller endpoints.
6. Test the functionality locally.
7. Create and run necessary migrations (if user requests).
