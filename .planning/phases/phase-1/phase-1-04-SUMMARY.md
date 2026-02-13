---
phase: phase-1
plan: 04
subsystem: persistence
tags: ["indexeddb", "dexie", "auto-save", "modal"]
requires: ["phase-1-03"]
provides: ["node-editing", "real-time-sync"]
affects: ["store", "ui"]
tech-stack: ["dexie", "react", "zustand"]
key-files:
  - src/components/chat/ChatOverlay.tsx
  - src/hooks/usePersistence.ts
  - src/store/useFlowStore.ts
  - src/db/repository.ts
  - src/components/canvas/FlowCanvas.tsx
metrics:
  duration: 20m
  tasks: 3
---

# Phase 1 Plan 04: Chat Overlay & Sync Summary

Implemented a foreground chat overlay for editing node content and established a real-time auto-save mechanism using IndexedDB (Dexie).

## Key Achievements

- **Chat Overlay**: A distraction-free modal editor for node content, triggered by clicking nodes on the canvas. Includes background blurring and interaction locking.
- **Debounced Persistence**: A custom `usePersistence` hook that monitors store changes and syncs nodes and edges to IndexedDB with a 300ms debounce, ensuring no data loss without sacrificing performance.
- **Project Hydration**: Automatic loading of tree data when entering a project, featuring a smooth loading state.
- **Improved Repository**: Expanded `projectRepository` to handle bulk node and edge operations.

## Key Decisions

- **Label as Primary Content**: In this phase, `data.label` is treated as the primary content field for nodes to ensure immediate visibility on the canvas.
- **Backdrop Blur for Focus**: Used `backdrop-blur-sm` on the overlay to visually isolate the editor from the canvas without completely hiding context.
- **Selective HUD Visibility**: HUD elements (buttons) are hidden while editing to minimize distraction.

## Deviations from Plan

- **Combined Load/Sync Logic**: Integrated hydration logic directly into `FlowCanvas` via `useEffect` to ensure data is always fresh when the project view mounts.
- **Clear Data on Exit**: Added a `clearData` action to `useFlowStore` to prevent data leaking between projects during the transition.

## Self-Check: PASSED
- [x] ChatOverlay component exists and is integrated.
- [x] usePersistence hook implements debounced sync.
- [x] Project data is correctly hydrated on load.
- [x] Commits made for all major changes.

## Verification Results
1. Create a tree -> OK.
2. Open a node, type, wait -> OK (Console logged "Auto-saved to IndexedDB").
3. Refresh the page -> OK.
4. Select project -> OK (Data restored).
