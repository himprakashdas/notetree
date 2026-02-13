---
phase: phase-1
plan: 01
type: execute
wave: 1
depends_on: []
files_modified: [package.json, tailwind.config.js, src/db/db.ts, src/store/useTreeStore.ts, src/main.tsx, src/App.tsx]
autonomous: true

must_haves:
  truths:
    - "Vite dev server starts without errors"
    - "Dexie database is initialized in the browser"
    - "Zustand store is accessible and has flat-map structure"
  artifacts:
    - path: "src/db/db.ts"
      provides: "Dexie database schema"
    - path: "src/store/useTreeStore.ts"
      provides: "Zustand flat-map store"
  key_links:
    - from: "src/store/useTreeStore.ts"
      to: "src/db/db.ts"
      via: "syncToDB action"
---

<objective>
Setup the project environment and establish the local persistence layer using Dexie.js and Zustand.

Purpose: Provide a robust foundation for DAG state management and local-first persistence.
Output: A running Vite app with a configured database and a flat-mapped state store.
</objective>

<execution_context>
@/Users/personal/.gemini/get-shit-done/workflows/execute-plan.md
@/Users/personal/.gemini/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/STATE.md
@.planning/research/STACK.md
@.planning/research/ARCHITECTURE.md
</context>

<tasks>

<task type="auto">
  <name>Environment Setup</name>
  <files>package.json, tailwind.config.js, src/main.tsx, src/App.tsx</files>
  <action>
    Initialize the project using Vite (React + TypeScript). 
    Install dependencies: `zustand`, `@xyflow/react`, `dexie`, `dexie-react-hooks`, `uuid`.
    Install dev dependencies: `tailwindcss`, `postcss`, `autoprefixer`, `@types/uuid`.
    Configure Tailwind with the Rose/White/Black theme specified in Phase1-CONTEXT.md.
    Setup basic project structure: `src/components`, `src/store`, `src/db`, `src/hooks`.
  </action>
  <verify>Run `npm run dev` and confirm the app loads.</verify>
  <done>Vite project is running with all necessary libraries and Tailwind configured.</done>
</task>

<task type="auto">
  <name>Dexie & Zustand Foundation</name>
  <files>src/db/db.ts, src/store/useTreeStore.ts</files>
  <action>
    1. Create `src/db/db.ts`: Define Dexie database `NoteTreeDB` with tables `projects`, `nodes`, and `edges`. Use materialized paths for nodes as suggested in ARCHITECTURE.md.
    2. Create `src/store/useTreeStore.ts`: Implement Zustand store using the flat-map pattern (Record<string, Node>). 
    3. Implement `saveProject`, `loadProject`, and `syncToDB` actions in the store.
    4. Ensure `nodes` and `edges` are stored separately to align with React Flow requirements.
  </action>
  <verify>Verify that calling `addNode` in the store results in an entry in IndexedDB (check DevTools -> Application -> IndexedDB).</verify>
  <done>Persistence layer is functional with a flat-mapped Zustand store syncing to Dexie.</done>
</task>

</tasks>

<verification>
Confirm that the app boots and that nodes added to the Zustand store persist across page refreshes via Dexie.
</verification>

<success_criteria>
- Vite + React + TS environment is ready.
- Tailwind is configured with the project color palette.
- Zustand store manages nodes/edges using a flat map.
- Dexie.js successfully persists and retrieves state from IndexedDB.
</success_criteria>

<output>
After completion, create `.planning/phases/phase-1/phase-1-01-SUMMARY.md`
</output>
