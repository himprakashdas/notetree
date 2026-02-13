---
phase: phase-2
plan: 02
type: execute
wave: 2
depends_on: ["phase-2-01"]
files_modified: [src/store/useAIStore.ts, src/store/useFlowStore.ts, src/utils/ai.ts]
autonomous: true

must_haves:
  truths:
    - "Context is snapshotted immediately when a request is enqueued"
    - "Requests are processed sequentially in a FIFO queue"
    - "AI nodes automatically trigger the queue"
  artifacts:
    - path: "src/store/useAIStore.ts"
      provides: "Zustand store with FIFO logic and snapshot storage"
  key_links:
    - from: "src/store/useFlowStore.ts"
      to: "src/store/useAIStore.ts"
      via: "enqueue(nodeId, snapshot) call"
---

<objective>
Implement the AI Queue and Snapshot mechanism. This ensures that the context used for generation is locked at the moment the user clicks "Send", even if the request is queued.

Purpose: Prevent mid-queue edits from affecting AI results and manage concurrency.
Output: A robust FIFO queue that stores context snapshots.
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
  <name>Task 1: Implement Context Snapshotting</name>
  <files>src/utils/ai.ts</files>
  <action>
    - Add `createContextSnapshot(projectId: string, nodeId: string)` to `src/utils/ai.ts`.
    - This function calls `projectRepository.getAIContext` and returns a structured object containing the `systemPrompt` and the `history` (formatted messages).
    - This "locks" the text of all nodes at the current moment.
  </action>
  <verify>Call `createContextSnapshot` and verify it returns the current state of ancestors/uncles.</verify>
  <done>Context can be frozen at any point in time.</done>
</task>

<task type="auto">
  <name>Task 2: Create useAIStore with FIFO & Snapshots</name>
  <files>src/store/useAIStore.ts</files>
  <action>
    - Initialize `useAIStore` with:
      - `queue`: Array of `{ nodeId: string, snapshot: any }`.
      - `isProcessing`: boolean.
    - Implement `enqueue(nodeId, snapshot)`:
      - Add to queue.
      - Call `processNext()`.
    - Implement `processNext()`:
      - If `isProcessing` or queue empty, return.
      - Set `isProcessing = true`.
      - Take first item.
      - (Stub) start generation with `snapshot`.
      - On finish, remove from queue, `isProcessing = false`, recurse.
  </action>
  <verify>Enqueue 3 items rapidly and verify they process one-by-one with their respective snapshots.</verify>
  <done>FIFO queue correctly handles snapshotted AI requests.</done>
</task>

<task type="auto">
  <name>Task 3: Connect FlowStore to Snapshot/Queue</name>
  <files>src/store/useFlowStore.ts</files>
  <action>
    - Update `addAIChild` and `addBranch` (when role is AI) in `useFlowStore`.
    - Immediately after creating the AI node:
      1. Call `createContextSnapshot(projectId, parentId)`.
      2. Call `useAIStore.getState().enqueue(newNodeId, snapshot)`.
    - Ensure this happens synchronously or within the same action flow to avoid latency.
  </action>
  <verify>Create an AI node and check that `useAIStore` receives the correct snapshot immediately.</verify>
  <done>AI generation is triggered with a locked context snapshot.</done>
</task>

</tasks>

<success_criteria>
- AI requests are stored in a queue with their own unique context snapshots.
- Editing an ancestor node after clicking "Send" but before processing starts does not affect the output.
- Sequential processing is maintained.
</success_criteria>

<output>
After completion, create `.planning/phases/phase-2/phase-2-02-SUMMARY.md`
</output>
