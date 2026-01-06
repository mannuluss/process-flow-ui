# Frontend AI Agent Instructions

You are an expert Frontend Developer specializing in **React**, **Vite**, and **Ant Design** working within a **Monorepo** structure.

## Project Context
- **Framework:** React (Vite)
- **Language:** TypeScript
- **UI Library:** Ant Design (antd)
- **Package Manager:** pnpm
- **Monorepo Shared Library:** `@process-flow/common` (located in `packages/common`)

## Development Guidelines

### 1. Architecture & Folder Structure
- **Feature-Based:** Organize code by features in `src/features/<feature-name>`.
  - `components/`: UI components specific to the feature.
  - `hooks/`: Logic and state management.
  - `services/`: API calls.
  - `pages/`: Route entry points.
- **Core:** `src/core/` for singleton services (API client), global types, and utilities.
- **Shared:** `src/shared/` for reusable UI components across features.
- more about architecture: `apps/frontend/docs/arquitecture.md`

### 2. UI & Design System (Ant Design)
- **Design Tokens:** NEVER use hardcoded hex colors or inline styles (`style={{ ... }}`).
- **Theming:** Use `theme.useToken()` to access design tokens.
  ```tsx
  const { token } = theme.useToken();
  // Usage: color: token.colorTextSecondary
  ```
  Prefer using default props and style overrides provided by Ant Design components.
- **Components:** Prefer Ant Design components (`Flex`, `Typography`, `Card`, etc.) over raw HTML divs.

### 3. State & Logic
- **Custom Hooks:** ALWAYS decouple logic from UI components using Custom Hooks.
  - Components should focus on rendering.
  - Hooks should handle state, effects, and data fetching.
- **Routing:** Use `RouteObject` configuration for React Router definitions.

### 4. API & Data Fetching
- **Client:** Use the configured Axios instance at `src/core/api/client.ts`.
- **Environment Variables:** ALWAYS use `src/environments/environments.ts` for API URLs and other environment-specific variables.
- **Shared Types:** ALWAYS import data models from `@process-flow/common`.
  ```typescript
  import { DataSource } from '@process-flow/common';
  ```
- **Services:** Encapsulate API calls in service files (e.g., `dataSource.service.ts`).
  - Create services as classes and export a singleton instance.

### 5. Testing (Vitest)
- **Focus:** Prioritize testing functionality (Hooks, Utils, Services).
- **On-Demand:** Only implement Unit Tests when explicitly requested.
- **Tool:** Use Vitest.

### 6. Workflow & Quality
- **Development Cycle:**
  1. Implement the complete functionality first.
  2. Run Linter/Fixer ONLY at the end of the task.
     - Command: `pnpm run lint:js:fix`
- **Package Management:** Use `pnpm` for all dependency operations.
