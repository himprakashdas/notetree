---
phase: 1.1
plan: 01
subsystem: Canvas & Logic
tags: [grounding, branching, hud, hotkeys]
requires: []
provides: [atomic-branching, role-toggle]
affects: [FlowCanvas, useFlowStore, useHotkeys]
tech-stack: [Tailwind 4, React Flow, Zustand]
key-files: [src/index.css, src/store/useFlowStore.ts, src/components/canvas/FlowCanvas.tsx, src/hooks/useHotkeys.ts]
decisions:
  - Adopted atomic turn-based model (User -> AI child, AI -> User child).
  - '+' button creates a sibling by default (same role), offset X+300.
  - Role Toggle in HUD acts as a creation override for the next node.
metrics:
  duration: 25m
  completed_date: 2026-02-13
---

# Phase 1.1 Plan 01: Foundation Logic & HUD Summary

## Objective
Establish the refined foundation for Phase 1.1 by fixing Tailwind 4 grounding issues, implementing smart role-based branching logic, and updating keyboard shortcuts.

## Key Changes

### 1. Tailwind 4 & Layout Grounding
- Updated `src/index.css` with explicit theme variables for branding (`rose-500`, `zinc-900`, `zinc-800`).
- Grounded the `ReactFlow` background dots to the canvas origin using theme-consistent colors.
- Ensured HUD elements are pinned to corners with appropriate safe areas.

### 2. Smart Branching Logic
- Refined `addBranch` in `useFlowStore.ts` to implement the atomic turn-based model:
    - **User Node + Plus**: Creates a **User Sibling** (X+300, same parent).
    - **AI Node + Plus**: Creates a **User Child** (Y+200, child of AI).
    - **Override**: Role Toggle in HUD overrides the default role for the next creation.
- Implemented `addAIChild` for explicit AI generation (Y+200, always AI, sets `thinking: true`).

### 3. Canvas HUD Refinement
- Added a **Role Toggle** switch in the top-right HUD to allow users to override the next node's role.
- Styled the toggle with branding colors: Rose-500 for Assistant and Zinc-100/800 for User.
- Improved transition effects and backdrop blurs for HUD elements.

### 4. Keyboard Shortcuts
- Updated `Cmd+Enter` (or `Ctrl+Enter`) behavior:
    - On **User node**: Triggers `addAIChild` (creates AI child).
    - On **AI node**: Triggers `addBranch` (creates User child/Reply).
- Ensured shortcuts work even when focused in an editor (with propagation stopping).

## Verification Results
- [x] HUD alignment: Elements are correctly pinned to corners.
- [x] Role Toggle: Correctly sets `nextRoleOverride` and resets after use.
- [x] Branching logic: User->User sibling and AI->User child defaults work as intended.
- [x] Keyboard shortcuts: Cmd+Enter triggers the correct branching based on selection.

## Deviations from Plan
None - plan executed exactly as written. (Note: Much of the store logic was pre-aligned with the refinement, verified and confirmed during execution).

## Self-Check: PASSED
- [x] Created files exist.
- [x] Commits made for key tasks.
- [x] Logic matches Phase 1.1 requirements.
