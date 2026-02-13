---
phase: phase-2
plan: 04
type: execute
wave: 4
depends_on: ["phase-2-03"]
files_modified: [src/store/useAIStore.ts, src/components/ui/Toaster.tsx, src/App.tsx]
autonomous: true

must_haves:
  truths:
    - "System automatically retries 3 times on connection failure"
    - "API errors are displayed as floating toasts"
    - "Safety-blocked content is handled gracefully without deleting the node"
  artifacts:
    - path: "src/store/useAIStore.ts"
      provides: "Exponential backoff retry logic"
  key_links:
    - from: "src/store/useAIStore.ts"
      to: "Toast Notification System"
      via: "State trigger or event"
---

<objective>
Enhance the reliability of AI generations by implementing automatic retries and providing clear feedback to the user when errors occur.

Purpose: Improve user trust and handle common API/network failures gracefully.
Output: Robust error handling and retry mechanism.
</objective>

<execution_context>
@/Users/personal/.gemini/get-shit-done/workflows/execute-plan.md
</execution_context>

<context>
@.planning/phases/phase-2/Phase2-CONTEXT.md
@.planning/phases/phase-2/RESEARCH.md
@src/store/useAIStore.ts
@.planning/phases/phase-2/phase-2-03-SUMMARY.md
</context>

<tasks>

<task type="auto">
  <name>Task 1: Implement Exponential Backoff Retries</name>
  <files>src/store/useAIStore.ts</files>
  <action>
    - Wrap the generation logic in a retry loop.
    - Max retries: 3.
    - Delay: 1s, 2s, 4s (exponential).
    - Only retry on network/connectivity errors, not safety blocks or auth errors.
    - Update node content to show "Retrying in X seconds..." during wait.
  </action>
  <verify>Simulate a network failure (offline mode) and observe the retry attempts in the console/UI.</verify>
  <done>System recovers from transient network issues automatically.</done>
</task>

<task type="auto">
  <name>Task 2: Global Error Feedback (Toasts)</name>
  <files>src/store/useAIStore.ts, src/App.tsx</files>
  <action>
    - Integrate a toast library (e.g., `sonner` or a simple custom one if already chosen in Phase 1).
    - Trigger a "Persistent, cancellable floating toast" when:
      - Max retries exceeded.
      - Auth error (invalid API key).
      - Rate limit reached.
    - Ensure toasts are displayed in the top-right as per CONTEXT.md.
  </action>
  <verify>Force an API error (e.g., invalid key) and verify the toast appears correctly.</verify>
  <done>Users are notified of non-recoverable AI errors.</done>
</task>

<task type="auto">
  <name>Task 3: Handle Safety Blocks</name>
  <files>src/store/useAIStore.ts</files>
  <action>
    - Check `candidate.finishReason === 'SAFETY'` during streaming.
    - If blocked, stop streaming and set node content to: "⚠️ Content Blocked: This response was filtered by safety settings."
    - Ensure the node is NOT deleted.
  </action>
  <verify>Use a prompt that triggers safety filters and check that the "Content Blocked" message is shown.</verify>
  <done>Safety-filtered content is handled without crashing the generation flow.</done>
</task>

</tasks>

<success_criteria>
- Failed requests retry up to 3 times with increasing delays.
- Clear toast notifications appear for unrecoverable errors.
- Safety-blocked nodes display a specific message instead of empty/broken content.
</success_criteria>

<output>
After completion, create `.planning/phases/phase-2/phase-2-04-SUMMARY.md`
</output>
