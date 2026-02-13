# Codebase Structure

**Analysis Date:** 2025-02-13

## Directory Layout

```
notetree/
├── docs/               # Project documentation (PRD, TDD)
├── src/                # Source code (Planned)
│   ├── adapters/       # External service implementations (LLM, Storage)
│   ├── domain/         # Core entities and pure business logic
│   ├── hooks/          # Custom React hooks (e.g., useTreeLayout)
│   ├── ports/          # Interface definitions (ILLMProvider, etc.)
│   ├── store/          # Zustand store and slices
│   ├── ui/             # React components and React Flow nodes
│   │   ├── canvas/     # Tree visualization components
│   │   ├── common/     # Shared UI components
│   │   └── sidebar/    # Configuration and info panels
│   ├── use-cases/      # Application-specific business rules
│   ├── App.tsx         # Root component
│   └── main.tsx        # Application entry point
├── package.json        # Dependencies and scripts
└── tsconfig.json       # TypeScript configuration (Planned)
```

## Directory Purposes

**docs/:**
- Purpose: Contains high-level design and requirement documents.
- Contains: Markdown files.
- Key files: `docs/prd.md`, `docs/tdd.md`.

**src/domain/ (Planned):**
- Purpose: Heart of the application; holds the "Enterprise Business Rules".
- Contains: Entity classes/interfaces and logic for tree manipulation.
- Key files: `src/domain/Node.ts`, `src/domain/Tree.ts`.

**src/use-cases/ (Planned):**
- Purpose: Implementation of "Application Business Rules".
- Contains: Classes or functions that orchestrate domain logic and external ports.
- Key files: `src/use-cases/BranchFromNode.ts`.

**src/adapters/ (Planned):**
- Purpose: Bridging the gap between the application and external technologies.
- Contains: API clients and storage implementations.
- Key files: `src/adapters/OpenAIAdapter.ts`, `src/adapters/LocalStorageRepository.ts`.

**src/ui/ (Planned):**
- Purpose: React-based presentation layer.
- Contains: Components, Styles, and React Flow customizations.

## Key File Locations

**Entry Points:**
- `src/main.tsx` (Planned): Bootstraps the React application.

**Configuration:**
- `package.json`: Project metadata and build scripts.
- `docs/tdd.md`: Technical source of truth for architecture.

## Naming Conventions

**Files:**
- Components: PascalCase (e.g., `ChatNode.tsx`)
- Logic/Entities: PascalCase or camelCase (e.g., `NoteTree.ts` or `treeLogic.ts`)
- Use Cases: PascalCase (e.g., `BranchFromNodeUseCase.ts`)

**Directories:**
- Kebab-case or camelCase (e.g., `use-cases` or `adapters`).

## Where to Add New Code

**New Feature:**
- Logic: `src/domain/` and `src/use-cases/`
- UI: `src/ui/`
- Integration: `src/adapters/`

**New Component/Module:**
- Implementation: `src/ui/` or `src/ui/canvas/`

**Utilities:**
- Shared helpers: `src/domain/utils/` (for pure logic) or `src/utils/` (for general helpers).

## Special Directories

**.gemini/ (Internal):**
- Purpose: Contains AI assistance skills and templates.
- Generated: No
- Committed: Yes

**.planning/ (Internal):**
- Purpose: Contains codebase analysis and implementation plans.
- Generated: Yes (by GSD tools)
- Committed: Yes

---

*Structure analysis: 2025-02-13*
