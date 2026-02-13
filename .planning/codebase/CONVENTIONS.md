# Coding Conventions

**Analysis Date:** 2025-02-13

## Naming Patterns

**Files:**
- React Components: PascalCase (e.g., `src/ui/canvas/ChatNode.tsx`)
- Domain Entities: PascalCase (e.g., `src/domain/NoteTree.ts`)
- Use Cases: PascalCase (e.g., `src/use-cases/BranchFromNodeUseCase.ts`)
- Ports/Interfaces: PascalCase (e.g., `src/ports/ILLMProvider.ts`)
- Utilities/Hooks: camelCase (e.g., `src/hooks/useTreeLayout.ts`)

**Directories:**
- Kebab-case (e.g., `src/use-cases/`, `src/ui/canvas/`)

**Functions:**
- camelCase (e.g., `calculateSlidingWindow()`, `execute()`)

**Variables:**
- camelCase (e.g., `nodeMap`, `activeLineage`)

**Types/Interfaces:**
- Interfaces: PascalCase, often prefixed with `I` for ports (e.g., `ILLMProvider`)
- Types: PascalCase (e.g., `NoteNode`)

## Code Style

**Formatting:**
- Planned: Prettier (Standard settings)
- Tab Width: 2 spaces

**Linting:**
- Planned: ESLint with TypeScript and React recommended rules.

**Language:**
- TypeScript (Strict mode enabled)

## Architecture Patterns

**Clean Architecture:**
- Dependencies must only point inward (UI -> Use Case -> Domain).
- Business logic resides in `src/domain/` and `src/use-cases/`.
- External dependencies (APIs, Storage) are hidden behind Ports (`src/ports/`) and implemented in Adapters (`src/adapters/`).

## Import Organization

**Order:**
1. React and related core libraries.
2. Third-party libraries (e.g., React Flow, Zustand).
3. Internal domain and use cases.
4. Internal ports and adapters.
5. UI components and styles.

**Path Aliases:**
- Recommended: `@/` for `src/` root.

## Error Handling

**Patterns:**
- **Adapter Error Wrapping:** Catch external API/Storage errors in Adapters and re-throw as domain-specific errors.
- **Use Case Propagation:** Use cases should return or throw errors that the UI can gracefully handle.
- **UI Feedback:** Use state-based error messages for user feedback (e.g., "Failed to connect to OpenAI").

## Logging

**Framework:** `console` (Development only)

**Patterns:**
- Avoid logging sensitive data (API keys, prompt content) in production.
- Use structured logging for debugging tree traversal.

## Comments

**When to Comment:**
- Complex business logic (e.g., the sliding window token calculation).
- Non-obvious React Flow customizations.

**JSDoc/TSDoc:**
- Use for documenting Port interfaces and Use Case `execute` methods.

## Function Design

**Size:** Keep functions small and focused (Single Responsibility Principle).

**Parameters:** Use object destructuring for functions with more than 2 parameters.

**Return Values:** Use explicit return types for public API methods and Use Cases.

## Module Design

**Exports:** Prefer named exports over default exports for better IDE support and refactorability.

**Barrel Files:** Use `index.ts` files in major directories (e.g., `src/domain/index.ts`) to simplify imports.

---

*Convention analysis: 2025-02-13*
