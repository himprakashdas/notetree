# Roadmap: NoteTree

## Phase 1: Foundation (Infinite Canvas & Persistence)
*Goal: Establish the visual workspace and local data storage.*
- [ ] Setup Vite + React + TypeScript environment.
- [ ] Integrate React Flow with Zustand for flat DAG state management.
- [ ] Implement IndexedDB persistence using Dexie.js (Nodes and Edges).
- [ ] Create basic Node UI (Text editing, placeholder for AI response).
- [ ] Implement Pan/Zoom and basic "Add Node" functionality.

## Phase 2: Core AI Integration (Branching & Context)
*Goal: Enable the core "Tree Learning" value proposition.*
- [ ] Integrate Gemini API client.
- [ ] Implement ancestor-based context inheritance logic.
- [ ] Build the "Branch" interaction (spawn child node from parent).
- [ ] Sequential request queueing to handle multiple AI calls.
- [ ] Basic token counting and error handling.

## Phase 3: Visual Management (Focus & Organization)
*Goal: Prevent "Tree Sprawl" and improve UI/UX.*
- [ ] Implement "Ghosting Mode" (dimming inactive lineages).
- [ ] Add Node folding/summarization (LLM-driven summaries).
- [ ] Implement "Visual Breadcrumbs" (navigation trail to root).
- [ ] Semantic coloring for nodes.

## Phase 4: Utilities & Refinement (Productivity)
*Goal: Enhance user efficiency and workflow.*
- [ ] "Copy Branch" feature (export lineage to Markdown).
- [ ] Multi-model support (OpenAI integration).
- [ ] Keyboard shortcuts (Cmd+Enter to branch, etc.).
- [ ] Performance optimization (viewport virtualization for 200+ nodes).

## Future Scope (Post-MVP)
- Branch merging.
- Session export/import (JSON/Markdown).
- Mobile "Drill-down" view.
- Real-time collaboration.
