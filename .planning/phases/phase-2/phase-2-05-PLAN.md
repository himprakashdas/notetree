---
phase: phase-2
plan: 05
type: execute
wave: 5
depends_on: ["phase-2-03"]
files_modified: [src/store/useAIStore.ts, src/components/canvas/ChatNode.tsx, src/store/useFlowStore.ts]
autonomous: true

must_haves:
  truths:
    - "Users can cancel active AI generations"
    - "Cancellation deletes the generating node"
    - "Long AI responses are scrollable within the node"
  artifacts:
    - path: "src/store/useAIStore.ts"
      provides: "AbortController management"
  key_links:
    - from: "src/components/canvas/ChatNode.tsx"
      to: "src/store/useAIStore.ts"
      via: "stopGeneration(nodeId) call"
---

<objective>
Provide users with control over active generations and ensure the UI handles long-form AI content gracefully.

Purpose: Allow cancellation of unwanted requests and improve readability.
Output: "Stop" functionality and scrollable nodes.
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
  <name>Task 1: Implement "Stop" Generation</name>
  <files>src/store/useAIStore.ts, src/components/canvas/ChatNode.tsx</files>
  <action>
    - Add `AbortController` management to `useAIStore`.
    - Map `nodeId` to `AbortController` in a state record.
    - Implement `stopGeneration(nodeId)`:
      - Call `controller.abort()`.
      - Delete the node from `useFlowStore`.
      - Clean up queue and processing state.
    - Add a "Stop" button (square icon) to `ChatNode.tsx` that only appears during generation/thinking.
  </action>
  <verify>Start a generation, click 'Stop', and verify the node is removed and the stream is aborted.</verify>
  <done>Users can interrupt unwanted AI generations.</done>
</task>

<task type="auto">
  <name>Task 2: Node Scrollability & Max Constraints</name>
  <files>src/components/canvas/ChatNode.tsx</files>
  <action>
    - Update `ChatNode.tsx` styles to handle long content.
    - Ensure the content container has `overflow-y-auto` and `scrollbar-thin`.
    - The node should respect the `maxHeight` set by `NodeResizer` or have a default `max-h-[400px]` if not resized.
    - Use `whitespace-pre-wrap` to preserve formatting while allowing wrapping.
  </action>
  <verify>Generate a long response and verify it becomes scrollable without breaking the canvas layout.</verify>
  <done>Long responses are easily readable within the nodes.</done>
</task>

<task type="auto">
  <name>Task 3: Basic System Prompt Support</name>
  <files>src/store/useFlowStore.ts, src/db/repository.ts</files>
  <action>
    - Ensure the `Project` loaded in `useFlowStore` includes the `systemPrompt`.
    - (Optional but recommended) Add a simple text area in the project UI (perhaps in a settings modal or a fixed HUD element) to allow editing the global system prompt.
    - For now, ensure it is at least retrieved and used in the generation context.
  </action>
  <verify>Manually set a system prompt in the DB and verify it influences AI responses.</verify>
  <done>The global system prompt is functional and integrated.</done>
</task>

</tasks>

<success_criteria>
- "Stop" button successfully aborts and deletes nodes.
- Long-form content is scrollable.
- System prompt is passed to the AI as the primary instruction.
</success_criteria>

<output>
After completion, create `.planning/phases/phase-2/phase-2-05-SUMMARY.md`
</output>
