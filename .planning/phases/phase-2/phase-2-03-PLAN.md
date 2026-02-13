---
phase: phase-2
plan: 03
type: execute
wave: 3
depends_on: ["phase-2-02"]
files_modified: [src/utils/ai.ts, src/store/useAIStore.ts, src/components/canvas/ChatNode.tsx]
autonomous: true

must_haves:
  truths:
    - "AI responses stream into nodes in real-time"
    - "Assistant nodes show 'Thinking...' text when in translucent state"
    - "Opacity returns to 1.0 once streaming begins"
  artifacts:
    - path: "src/utils/ai.ts"
      provides: "Gemini SDK initialization and streaming helper"
    - path: "src/components/canvas/ChatNode.tsx"
      provides: "Thinking state UI indicator"
  key_links:
    - from: "src/store/useAIStore.ts"
      to: "Google Gemini API"
      via: "@google/generative-ai sendMessageStream"
---

<objective>
Implement the streaming logic using the Gemini SDK and update the UI to provide clear feedback during the generation process.

Purpose: Provide immediate visual confirmation and a sense of "liveness" to the user.
Output: Streaming AI nodes with "Thinking..." indicators.
</objective>

<execution_context>
@/Users/personal/.gemini/get-shit-done/workflows/execute-plan.md
</execution_context>

<context>
@.planning/phases/phase-2/Phase2-CONTEXT.md
@.planning/phases/phase-2/RESEARCH.md
@src/store/useAIStore.ts
@src/components/canvas/ChatNode.tsx
@.planning/phases/phase-2/phase-2-02-SUMMARY.md
</context>

<tasks>

<task type="auto">
  <name>Task 1: Setup Gemini SDK & Streaming Loop</name>
  <files>src/utils/ai.ts, src/store/useAIStore.ts</files>
  <action>
    - Initialize `GoogleGenerativeAI` in `src/utils/ai.ts`.
    - Implement `processNext` in `useAIStore.ts`:
      1. Use `snapshot.history` to call `model.sendMessageStream`.
      2. Iterate through the stream.
      3. On each chunk, call `useFlowStore.getState().updateNodeContent(nodeId, accumulatedText)`.
      4. On the first chunk, also set `thinking: false` for the node.
  </action>
  <verify>Trigger an AI generation and observe the text appearing chunk-by-chunk on the canvas.</verify>
  <done>AI responses stream in real-time.</done>
</task>

<task type="auto">
  <name>Task 2: Implement "Thinking..." UI Indicator</name>
  <files>src/components/canvas/ChatNode.tsx</files>
  <action>
    - Update `ChatNode.tsx` to check `data.thinking`.
    - If `thinking` is true:
      - Display "Thinking..." text inside the node (instead of empty space or dots).
      - Ensure the 0.5 opacity is applied (already exists, but verify it works with the text).
    - Ensure that once `thinking` is false, the text is replaced by the actual streamed content.
  </action>
  <verify>Create an AI node and verify it says "Thinking..." until the first response chunk arrives.</verify>
  <done>UI clearly communicates the AI's internal state.</done>
</task>

<task type="auto">
  <name>Task 3: Background Persistence (Throttled Sync)</name>
  <files>src/store/useAIStore.ts</files>
  <action>
    - Add logic to `useAIStore` to save the node's content to `projectRepository` during streaming.
    - Use a throttled approach (e.g., every 500ms or every 10 chunks) to avoid overwhelming IndexedDB.
    - Ensure a final save occurs when the stream completes or errors out.
  </action>
  <verify>Refresh the browser mid-stream and check if partial content was saved in the database.</verify>
  <done>Partial results are persisted to prevent data loss.</done>
</task>

</tasks>

<success_criteria>
- AI nodes transition from "Thinking..." to active streaming.
- Opacity shifts from 0.5 to 1.0 when streaming starts.
- Content is saved to Dexie even if the process is interrupted.
</success_criteria>

<output>
After completion, create `.planning/phases/phase-2/phase-2-03-SUMMARY.md`
</output>
