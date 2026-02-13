---
phase: phase-2
plan: 05
type: execute
wave: 4
depends_on: ["phase-2-03"]
files_modified: [src/store/useAIStore.ts, src/components/canvas/ChatNode.tsx, src/store/useFlowStore.ts]
autonomous: true

must_haves:
  truths:
    - "Users can stop an active AI generation"
    - "Stopping a generation deletes the pending Assistant node"
    - "Nodes become scrollable if content exceeds bounds"
  artifacts:
    - path: "src/store/useAIStore.ts"
      provides: "AbortController management"
  key_links:
    - from: "src/components/canvas/ChatNode.tsx"
      to: "src/store/useAIStore.ts"
      via: "stopGeneration(nodeId) call"
---

<objective>
Provide users with control over active AI generations and polish the node UI for long-form content.

Purpose: Allow users to cancel unwanted generations and ensure readability of long responses.
Output: "Stop" functionality and scrollable node content.
</objective>

<execution_context>
@/Users/personal/.gemini/get-shit-done/workflows/execute-plan.md
</execution_context>

<context>
@.planning/phases/phase-2/Phase2-CONTEXT.md
@.planning/phases/phase-2/RESEARCH.md
@src/components/canvas/ChatNode.tsx
@src/store/useAIStore.ts
@.planning/phases/phase-2/phase-2-03-SUMMARY.md
</context>

<tasks>

<task type="auto">
  <name>Task 1: Implement Stop Generation</name>
  <files>src/store/useAIStore.ts, src/components/canvas/ChatNode.tsx</files>
  <action>
    - Add `AbortController` management to `useAIStore`.
    - Map `nodeId` to its `AbortController` in a `controllers` record.
    - Implement `stopGeneration(nodeId)` action:
      - Call `controller.abort()`.
      - Delete the node via `useFlowStore.getState().deleteNodeOnly(nodeId)`.
      - Remove from queue/processing.
    - Add a "Stop" button to `ChatNode.tsx` that only appears when `thinking` or streaming is active.
  </action>
  <verify>Start a long generation and click "Stop". Verify the node disappears and the API request is aborted.</verify>
  <done>Users can cancel active AI generations.</done>
</task>

<task type="auto">
  <name>Task 2: Node Scrollability & Sizing Polish</name>
  <files>src/components/canvas/ChatNode.tsx, src/index.css</files>
  <action>
    - Ensure `ChatNode` has `overflow-y-auto` on its content container.
    - Set a `max-height` (consistent with Phase 1.1 limits) to force scrollbars for long content.
    - Use Tailwind's `scrollbar-hide` or custom thin scrollbars for better aesthetics on the canvas.
  </action>
  <verify>Generate a long response and ensure the node displays scrollbars and doesn't expand infinitely.</verify>
  <done>Long AI responses are readable within the canvas nodes.</done>
</task>

</tasks>

<success_criteria>
- "Stop" button successfully aborts API calls and removes nodes.
- Long-form content inside nodes is scrollable and constrained by min/max sizing.
- "Thinking" state transitions cleanly to final text state.
</success_criteria>

<output>
After completion, create `.planning/phases/phase-2/phase-2-05-SUMMARY.md`
</output>
