---
phase: phase-2
plan: 02
type: execute
wave: 2
depends_on: ["phase-2-01"]
files_modified: [src/store/useAIStore.ts, src/store/useFlowStore.ts]
autonomous: true

must_haves:
  truths:
    - "AI requests are processed sequentially (FIFO)"
    - "Generations continue in the background if the canvas is unmounted"
  artifacts:
    - path: "src/store/useAIStore.ts"
      provides: "FIFO queue and generation management loop"
  key_links:
    - from: "src/store/useFlowStore.ts"
      to: "src/store/useAIStore.ts"
      via: "enqueue call in node creation"
---

<objective>
Implement the FIFO queue and background generation store. This ensures that AI requests are handled in order and persist even if the user navigates away from the project view.

Purpose: Manage concurrency and ensure system reliability during heavy AI usage.
Output: A dedicated Zustand store for AI operations.
</objective>

<execution_context>
@/Users/personal/.gemini/get-shit-done/workflows/execute-plan.md
</execution_context>

<context>
@.planning/phases/phase-2/Phase2-CONTEXT.md
@.planning/phases/phase-2/RESEARCH.md
@src/store/useFlowStore.ts
@.planning/phases/phase-2/phase-2-01-SUMMARY.md
</context>

<tasks>

<task type="auto">
  <name>Task 1: Create useAIStore with FIFO Queue</name>
  <files>src/store/useAIStore.ts</files>
  <action>
    - Initialize `useAIStore` with:
      - `queue`: Array of `{ projectId: string, nodeId: string }`.
      - `isProcessing`: boolean.
    - Implement `enqueue(projectId, nodeId)` action.
    - Implement `processNext()` internal loop:
      - If `isProcessing` or queue is empty, exit.
      - Set `isProcessing = true`.
      - Get first item from queue.
      - (Stub) call to generation logic.
      - On finish, remove from queue, set `isProcessing = false`, call `processNext()`.
  </action>
  <verify>Enqueue multiple items and verify they are added to the queue and processed one-by-one (using console logs for stubs).</verify>
  <done>FIFO queue logic is functional and handles sequential processing.</done>
</task>

<task type="auto">
  <name>Task 2: Connect FlowStore to AIStore</name>
  <files>src/store/useFlowStore.ts</files>
  <action>
    - Update `addAIChild` and `addBranch` (when role is AI) in `useFlowStore` to call `useAIStore.getState().enqueue(projectId, newNodeId)`.
    - Ensure `projectId` is passed correctly to the store actions.
    - Note: This triggers the background generation process as soon as an AI node is created.
  </action>
  <verify>Create an AI node in the UI and check that it appears in the `useAIStore` queue.</verify>
  <done>AI node creation automatically triggers the generation queue.</done>
</task>

</tasks>

<success_criteria>
- `useAIStore` manages a persistent queue of pending AI generations.
- Queue processing is sequential (one request at a time).
- Creating an AI node in `useFlowStore` automatically enqueues a request in `useAIStore`.
</success_criteria>

<output>
After completion, create `.planning/phases/phase-2/phase-2-02-SUMMARY.md`
</output>
