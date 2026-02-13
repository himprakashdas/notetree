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
    - "System retries connection failures 3 times with exponential backoff"
    - "Errors (Auth, Rate Limit) appear as floating toasts"
    - "Safety-blocked content displays a specific message instead of deleting the node"
  artifacts:
    - path: "src/store/useAIStore.ts"
      provides: "Retry logic and safety filter checks"
  key_links:
    - from: "src/store/useAIStore.ts"
      to: "Toast Notification System"
      via: "sonner or custom toast call"
---

<objective>
Build resilience into the AI integration by handling network failures, safety filters, and providing global feedback for unrecoverable errors.

Purpose: Improve reliability and user trust.
Output: Robust error handling and notification system.
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
    - Wrap the streaming loop in a try-catch-retry structure.
    - Max retries: 3.
    - Delays: 1s, 2s, 4s.
    - Only retry on connectivity errors (e.g., fetch failed, network timeout).
    - Update node content to show "Retrying in X seconds..." during the wait period.
    - If all retries fail, delete the node and show a toast.
  </action>
  <verify>Disconnect internet mid-stream and observe the retry attempts and eventual cleanup.</verify>
  <done>System handles transient network issues gracefully.</done>
</task>

<task type="auto">
  <name>Task 2: Safety Filter Handling</name>
  <files>src/store/useAIStore.ts</files>
  <action>
    - In the stream iterator, check `chunk.candidates[0].finishReason`.
    - If reason is 'SAFETY', stop the stream and set node content to: "⚠️ Content Blocked: This response was filtered by safety settings."
    - Ensure the node remains on the canvas but is marked as finished.
  </action>
  <verify>Trigger a safety filter block and verify the specific message is displayed without deleting the node.</verify>
  <done>Safety-blocked content is handled per design requirements.</done>
</task>

<task type="auto">
  <name>Task 3: Global Error Feedback (Toasts)</name>
  <files>src/store/useAIStore.ts, src/App.tsx</files>
  <action>
    - Install `sonner` or a similar lightweight toast library.
    - Setup the `Toaster` component in `src/App.tsx`.
    - Trigger toasts for:
      - Max retries exceeded.
      - Invalid API Key (401).
      - Quota exceeded (429).
    - Toasts should be persistent and appear in the top-right.
  </action>
  <verify>Force an auth error and verify the toast notification appears correctly.</verify>
  <done>Users receive clear feedback for unrecoverable API errors.</done>
</task>

</tasks>

<success_criteria>
- Failed requests retry up to 3 times before giving up.
- Safety blocks show a ⚠️ message.
- Toasts appear for critical failures.
</success_criteria>

<output>
After completion, create `.planning/phases/phase-2/phase-2-04-SUMMARY.md`
</output>
