# Project State: NoteTree

## Current Phase: Phase 1 (Foundation)
**Status**: Executing Plan 04
**Progress**: 3/5 Plans
**Goal**: Establish the infinite canvas and persistence foundation.

## Completed Milestones
- [x] Codebase analysis and mapping.
- [x] Technical stack selection (Vite, React Flow, Zustand, Dexie).
- [x] Domain research on DAG state and context inheritance.
- [x] Project requirements defined.
- [x] High-level roadmap established.
- [x] Project Foundation & Persistence Setup (Plan 01).
- [x] Infinite Canvas & Custom Nodes (Plan 02).
- [x] Interaction & Branching (Plan 03).

## Active Tasks
- [x] Initialize Vite + React project.
- [x] Scaffold React Flow + Zustand integration (Plan 01/02).
- [x] Implement Branching & Tree Logic (Plan 03).
- [ ] Implement Sliding Window Context Inheritance (Plan 04).

## Decisions
- [x] Use Tailwind 4 for CSS-first styling.
- [x] Use Repository pattern for Dexie DB access.
- [x] [Phase 1]: Use @xyflow/react (v12) for the canvas foundation.
- [x] [Phase 1]: Disable manual edge drawing to enforce branching-only tree growth.
- [x] [Phase 1]: Use a Rose-themed (rose-500) border for AI nodes and Neutral for User nodes.
- [x] [Phase 1]: Use React Flow's 'setCenter' for smooth auto-panning to new nodes.
- [x] [Phase 1]: Implement canvas shortcuts (Delete, Cmd+Enter) via native event listeners in a custom hook.

## Context Memory
- **Root Concept**: Tree-based LLM interaction to solve linear fatigue.
- **Key Constraint**: Desktop-first, local persistence (no server).
- **Inheritance Pattern**: Root + last N ancestors (Sliding Window).
- **Persistence Pattern**: IndexedDB via Dexie.js for large DAGs.

## Session Info
- **Last session**: 2024-02-13
- **Stopped at**: Completed Phase 1 Plan 03
