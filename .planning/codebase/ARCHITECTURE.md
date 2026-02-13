# Architecture

**Analysis Date:** 2025-02-13

## Pattern Overview

**Overall:** Clean Architecture / Hexagonal (Ports & Adapters)

**Key Characteristics:**
- **Dependency Rule:** Dependencies only point inward toward the Domain Layer (Entities).
- **Separation of Concerns:** Core business logic is decoupled from UI (React), State Management (Zustand), and External APIs (LLM Providers).
- **Testability:** Domain logic and use cases are designed to be tested in isolation without infrastructure dependencies.

## Layers

**Entities (Domain Layer):**
- Purpose: Represents core business objects and rules.
- Location: `src/domain/` (Planned)
- Contains: `Node`, `Tree` entities, and pure functions for context logic (e.g., sliding window calculations).
- Depends on: None.
- Used by: Use Cases, Interface Adapters.

**Use Cases (Application Layer):**
- Purpose: Orchestrates the flow of data to and from entities; implements application-specific business rules.
- Location: `src/use-cases/` (Planned)
- Contains: `BranchFromNodeUseCase`, `SummarizeBranchUseCase`, `GetContextLineageUseCase`.
- Depends on: Entities, Ports (Interfaces).
- Used by: UI Controllers/Hooks.

**Interface Adapters (Green Layer):**
- Purpose: Converts data between the format most convenient for use cases/entities and the format most convenient for external agencies (UI, DB, APIs).
- Location: `src/adapters/` (Planned)
- Contains: `OpenAIAdapter`, `LocalStorageRepository`, UI Controllers.
- Depends on: Use Cases, Entities, Ports.
- Used by: Frameworks & Drivers.

**Frameworks & Drivers (Blue Layer):**
- Purpose: Tools and frameworks like React, React Flow, and Zustand.
- Location: `src/ui/`, `src/store/`, `src/infrastructure/` (Planned)
- Contains: React components, Zustand store slices, React Flow configuration.
- Depends on: All inner layers.
- Used by: Entry points.

## Data Flow

**LLM Interaction Flow:**

1. **User Action:** User triggers a branch in the `React UI`.
2. **Orchestration:** UI calls a controller/hook which invokes `BranchFromNodeUseCase`.
3. **Context Preparation:** Use Case calls `GetContextLineageUseCase` to retrieve and format the ancestor chain.
4. **External Call:** Use Case calls the `ILLMProvider` port (implemented by `OpenAIAdapter`).
5. **State Update:** Upon response, Use Case updates the `Tree` entity and persists it via `ITreeRepository`, then updates the `Zustand` store.

**State Management:**
- **Zustand:** Used as the source of truth for the UI. It holds a flat map of nodes to ensure high-performance updates and easy integration with React Flow's viewport virtualization.

## Key Abstractions

**ILLMProvider (Port):**
- Purpose: Interface for sending messages to LLM services.
- Examples: `src/ports/ILLMProvider.ts` (Planned)
- Pattern: Strategy Pattern for multiple LLM support.

**ITreeRepository (Port):**
- Purpose: Interface for persisting and loading the conversation tree.
- Examples: `src/ports/ITreeRepository.ts` (Planned)
- Pattern: Repository Pattern.

## Entry Points

**Vite Dev Server:**
- Location: `package.json` (root)
- Triggers: `npm run dev`
- Responsibilities: Serves the React application.

**Main Entry File:**
- Location: `src/main.tsx` (Planned)
- Triggers: Browser load.
- Responsibilities: Initializes the React application and mounts the root component.

## Error Handling

**Strategy:** Explicit error handling in Adapters with propagation to the UI via Use Cases.

**Patterns:**
- **Adapter Error Wrapping:** External API errors are caught in Adapters and re-thrown as Domain-specific errors.
- **UI Error Boundaries:** React Error Boundaries for catching rendering errors in the tree canvas.

## Cross-Cutting Concerns

**Logging:** Minimal client-side logging (console) planned for development.
**Validation:** Zod or similar for validating LLM API responses and configuration.
**Authentication:** Client-side management of API keys via local storage (no backend).

---

*Architecture analysis: 2025-02-13*
