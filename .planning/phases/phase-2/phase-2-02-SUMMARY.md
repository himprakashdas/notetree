---
phase: phase-2
plan: 02
subsystem: AI Queue & Context
tags: [zustand, fifo, snapshot, dexie]
requires: ["phase-2-01"]
provides: ["fifo-queue", "context-lock"]
affects: ["src/store/useFlowStore.ts", "src/utils/ai.ts"]
tech-stack: [Zustand, Dexie]
key-files: [src/store/useAIStore.ts, src/utils/ai.ts, src/store/useFlowStore.ts]
decisions:
  - "Use a standalone useAIStore for managing the FIFO queue and background processing state"
  - "Capture context snapshot using current store state to avoid stale reads from debounced DB persistence"
metrics:
  duration: 25m
  completed_date: "2026-02-13"
---

# Phase 2 Plan 02: FIFO Queue and Background Generation Store Summary

Implemented a robust FIFO (First-In-First-Out) queue for AI requests, ensuring that each request is processed sequentially with a "locked" context snapshot captured at the exact moment of enqueuing.

## Key Accomplishments

- **Context Snapshotting**: Created a utility to freeze the current state of ancestors and uncles, formatting them into a Gemini-compatible history.
- **AI Store (Zustand)**: Implemented `useAIStore` which manages a queue of requests and processes them one by one in the background.
- **Seamless Integration**: Connected `useFlowStore` to the AI queue. Clicking "Send" or adding an AI child now automatically enqueues a request with its corresponding snapshot.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Stale context data during snapshotting**
- **Found during:** Task 3 verification
- **Issue:** `createContextSnapshot` was reading from the database, but `usePersistence` has a 300ms debounce. This meant enqueuing a request immediately after a node edit would capture the *old* content from the database.
- **Fix:** Modified `projectRepository.getAIContext` and `createContextSnapshot` to accept optional `nodes` and `edges`. Passed the current store state from `useFlowStore` during enqueuing.
- **Files modified:** `src/db/repository.ts`, `src/utils/ai.ts`, `src/store/useFlowStore.ts`
- **Commit:** `109e2ec`

## Verification Results

- **FIFO Processing**: `processNext` correctly handles sequential processing by shifting items from the queue.
- **Context Lock**: Snapshotting captures the full context (root + 3 ancestors + uncles) and formats it into messages.
- **Flow Integration**: AI nodes are created in a "thinking" state and their generation is enqueued immediately.

## Self-Check: PASSED
- [x] All tasks executed.
- [x] Each task committed individually.
- [x] Deviations documented.
- [x] SUMMARY.md created.
- [x] Commits exist in git log.
