---
phase: phase-1
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - package.json
  - src/db/schema.ts
  - src/db/repository.ts
  - src/store/useAppStore.ts
  - src/components/project/ProjectGallery.tsx
  - src/App.tsx
autonomous: true
must_haves:
  truths:
    - "User can create a new project and see it in the gallery"
    - "User can delete a project from the gallery"
    - "The app opens to the Project Gallery by default"
  artifacts:
    - path: "src/db/schema.ts"
      provides: "Dexie database definition"
    - path: "src/store/useAppStore.ts"
      provides: "Project management state"
    - path: "src/components/project/ProjectGallery.tsx"
      provides: "Project selection UI"
  key_links:
    - from: "src/components/project/ProjectGallery.tsx"
      to: "src/db/repository.ts"
      via: "Direct DB calls or Store actions"
---

<objective>
Establish the project foundation, local database schema, and the project entry point (Gallery).

Purpose: Enable project-based organization and ensure local persistence from the start.
Output: Initialized React project with Dexie schema and a functional Project Gallery.
</objective>

<execution_context>
@/Users/personal/.gemini/get-shit-done/workflows/execute-plan.md
@/Users/personal/.gemini/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/phases/phase-1/RESEARCH.md
@.planning/Phase1-CONTEXT.md
</context>

<tasks>

<task type="auto">
  <name>Setup Project & Dependencies</name>
  <files>package.json, tailwind.config.js, src/index.css</files>
  <action>
    Initialize a Vite + React + TypeScript project. 
    Install core dependencies: @xyflow/react, zustand, dexie, lucide-react, nanoid, clsx, tailwind-merge, date-fns.
    Setup Tailwind CSS with the Rose primary color (#F43F5E) and Dark theme defaults (Black background).
    Configure basic folder structure: src/components, src/db, src/store, src/hooks, src/types, src/utils.
  </action>
  <verify>npm list shows installed dependencies; npm run dev starts without error.</verify>
  <done>Project is scaffolded with required libraries and Tailwind colors.</done>
</task>

<task type="auto">
  <name>Initialize Dexie DB Schema & Repository</name>
  <files>src/db/schema.ts, src/db/repository.ts, src/types/index.ts</files>
  <action>
    Implement the Dexie schema as defined in RESEARCH.md.
    Define tables: 'projects' (id, name, createdAt, lastModified), 'nodes' (id, projectId, data, type, position), 'edges' (id, projectId, source, target).
    Create a repository layer for CRUD operations on projects.
    Define TypeScript interfaces for Project, NodeData, and FlowElements.
  </action>
  <verify>Dexie DB initializes in DevTools -> Application -> IndexedDB.</verify>
  <done>Persistence layer is ready for project and node storage.</done>
</task>

<task type="auto">
  <name>Implement Project Gallery & App Store</name>
  <files>src/store/useAppStore.ts, src/components/project/ProjectGallery.tsx, src/App.tsx</files>
  <action>
    Create useAppStore to manage 'activeProject' and 'projects' list.
    Build ProjectGallery component: 
    - Display list of projects with name and last modified date.
    - "New Project" button (creates project in DB, updates store, sets as active).
    - "Delete" icon on project cards with simple confirmation.
    Update App.tsx to conditionally render ProjectGallery if no activeProject is set.
    Use Lucide icons for project actions.
  </action>
  <verify>User can create a project, see it in the list, and select it (clearing the gallery view).</verify>
  <done>User can manage projects before entering the infinite canvas.</done>
</task>

</tasks>

<verification>
1. Run `npm run dev`.
2. Open Browser -> Application -> IndexedDB -> NoteTreeDB.
3. Create 2 projects. Verify they appear in UI and DB.
4. Delete 1 project. Verify it is removed from UI and DB.
</verification>

<success_criteria>
Project Gallery allows creation and deletion of local projects stored in IndexedDB.
</success_criteria>

<output>
After completion, create `.planning/phases/phase-1/phase-1-01-SUMMARY.md`
</output>
