# Project State: NoteTree

## Current Phase: Phase 2 (Core AI Integration)
**Status**: Executing
**Progress**: 4/5 Plans
**Goal**: Enable the core "Tree Learning" value proposition with Gemini integration.

## Completed Milestones
- [x] Codebase analysis and mapping.
- [x] Technical stack selection (Vite, React Flow, Zustand, Dexie).
- [x] Domain research on DAG state and context inheritance.
- [x] Project requirements defined.
- [x] High-level roadmap established.
- [x] Phase 1: Foundation (Plans 01-05 completed).
- [x] Phase 1.1: Refined Foundation & Interactions (Plans 01-03 completed).
- [x] Phase 2: Plan 01 (API & Context Logic).
- [x] Phase 2: Plan 02 (FIFO Queue & Background Generation Store).
- [x] Phase 2: Plan 03 (Streaming UI & SDK Integration).
- [x] Phase 2: Plan 04 (Error Handling & Retries).

## Active Tasks
- [ ] phase-2-05-PLAN.md — Polish, Transitions & UI/UX Refinements

## Decisions
- [x] Use Tailwind 4 for CSS-first styling.
- [x] Use Repository pattern for Dexie DB access.
- [x] [Phase 1.1]: Adopt Atomic (One-turn-per-node) model.
- [x] [Phase 1.1]: Implement Triple-Action Hover Bar: Delete (Left), Plus (Center), Send (Right).
- [x] [Phase 1.1]: '+' button creates a sibling of the SAME role (User -> User), offset to the side.
- [x] [Phase 1.1]: 'Send' button creates an AI child node in a "Thinking" state (0.5 alpha).
- [x] [Phase 1.1]: Truncate node text with "..." and constrain resizing within min/max limits.
- [x] [Phase 1.1]: Add dev-mode Role Toggle in top-right to set role for next created node.
- [x] [Phase 2]: AI receives direct path to root + siblings of immediate parent.
- [x] [Phase 2]: Pruning: Root + 3 most recent ancestors.
- [x] [Phase 2]: FIFO Queue for all requests (Background processing).
- [x] [Phase 2]: Automatic retry (3 times) with exponential backoff.
- [x] [Phase 2]: Streaming UI with translucent "Thinking" state.
- [x] [Phase 2]: Added createdAt to NodeData for context sorting
- [x] [Phase 2]: Merged same-role messages in Gemini prompt formatter
- [x] [Phase 2]: Use a standalone useAIStore for managing the FIFO queue and background processing state
- [x] [Phase 2]: Capture context snapshot using current store state to avoid stale reads from debounced DB persistence
- [x] [Phase 2]: Use a pulse animation and 'Thinking...' text for AI nodes during the generation process
- [x] [Phase 2]: Throttle database persistence during streaming to every 10 chunks to balance performance and safety
- [x] [Phase 2]: Use sonner for toast notifications
- [x] [Phase 2]: 10s duration for critical errors
- [x] [Phase 2]: Delete node on final AI generation failure

## Performance Metrics
- **Phase 1.1 Plan 01**: 25m, 3 tasks, 4 files.
- **Phase 1.1 Plan 02**: 15m, 2 tasks, 2 files.
- **Phase 1.1 Plan 03**: 20m, 2 tasks, 3 files.
- **Phase 2 Plan 01**: 40m, 5 tasks, 5 files.
- **Phase 2 Plan 02**: 25m, 3 tasks, 3 files.
- **Phase 2 Plan 03**: 20m, 3 tasks, 7 files.
- **Phase 2 Plan 04**: 15m, 3 tasks, 3 files.

## Session Info
- **Last session**: 2026-02-13
- **Stopped at**: Completed 2-04-PLAN.md
