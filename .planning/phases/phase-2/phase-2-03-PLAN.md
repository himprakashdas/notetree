---
phase: phase-2
plan: 03
type: execute
wave: 3
depends_on: ["phase-2-02"]
files_modified: [src/store/useAIStore.ts, src/store/useFlowStore.ts, src/db/repository.ts]
autonomous: true

must_haves:
  truths:
    - "AI responses stream into nodes in real-time"
    - "Thinking state (translucency) clears once streaming starts"
    - "Partial responses are persisted to Dexie to prevent data loss"
  artifacts:
    - path: "src/store/useAIStore.ts"
      provides: "Streaming implementation using Gemini SDK"
  key_links:
    - from: "src/store/useAIStore.ts"
      to: "src/db/repository.ts"
      via: "bulkUpdate/put during streaming"
---

<objective>
Implement real-time streaming of AI responses into the canvas nodes. This plan connects the API client to the store and ensures that data is persisted as it arrives.

Purpose: Provide immediate visual feedback to the user and ensure data durability.
Output: Streaming AI responses with real-time UI updates.
</objective>

<execution_context>
@/Users/personal/.gemini/get-shit-done/workflows/execute-plan.md
</execution_context>

<context>
@.planning/phases/phase-2/Phase2-CONTEXT.md
@.planning/phases/phase-2/RESEARCH.md
@src/store/useAIStore.ts
@src/store/useFlowStore.ts
@.planning/phases/phase-2/phase-2-02-SUMMARY.md
</context>

<tasks>

<task type="auto">
  <name>Task 1: Implement AI Streaming in Store</name>
  <files>src/store/useAIStore.ts</files>
  <action>
    - Replace the `processNext` stub with actual Gemini streaming logic:
      1. Fetch context using `projectRepository.getAIContext`.
      2. Format prompt using `formatPrompt`.
      3. Call `model.sendMessageStream(prompt)`.
      4. Iterate over `result.stream`.
      5. For each chunk:
         - Update the node's `content` in `useFlowStore` state.
         - Set `thinking: false` on the first chunk.
  </action>
  <verify>Trigger a generation and observe the node content updating in real-time on the canvas.</verify>
  <done>AI responses stream successfully into the application state.</done>
</task>

<task type="auto">
  <name>Task 2: Persistent Streaming (Dexie Sync)</name>
  <files>src/store/useAIStore.ts, src/db/repository.ts</files>
  <action>
    - Add a `debounce` or throttled update to `projectRepository` to save the partial node content to IndexedDB during streaming.
    - Ensure the final content is saved once the stream completes.
    - Update `src/db/repository.ts` with a `partialUpdateNode(nodeId, data)` method if needed.
  </action>
  <verify>Interrupt a stream (e.g., refresh page) and check that partial content was saved in IndexedDB.</verify>
  <done>Streamed content is persisted to storage to avoid data loss on crashes or navigation.</done>
</task>

</tasks>

<verification>
- AI nodes transition from "Thinking" (translucent) to active streaming as soon as the first chunk arrives.
- Large responses stream smoothly without blocking the UI thread.
- Data is correctly saved to Dexie throughout the generation process.
</verification>

<success_criteria>
- AI nodes update visually as chunks arrive from Gemini.
- `thinking` flag is cleared when generation starts.
- Node content in IndexedDB matches the final streamed output.
</success_criteria>

<output>
After completion, create `.planning/phases/phase-2/phase-2-03-SUMMARY.md`
</output>
