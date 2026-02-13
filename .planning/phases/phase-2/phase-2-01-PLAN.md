---
phase: phase-2
plan: 01
type: execute
wave: 1
depends_on: []
files_modified: [src/db/repository.ts, src/utils/ai.ts, .env.example]
autonomous: true
user_setup:
  - service: Gemini API
    why: "Required for AI-powered node generation"
    env_vars:
      - name: VITE_GEMINI_API_KEY
        source: "Google AI Studio (https://aistudio.google.com/app/apikey)"

must_haves:
  truths:
    - "AI context includes root node and recent ancestors"
    - "Prompt is formatted with User/Assistant roles"
    - "Gemini client is correctly initialized with API key"
  artifacts:
    - path: "src/utils/ai.ts"
      provides: "Gemini client initialization and prompt formatting"
    - path: "src/db/repository.ts"
      provides: "Ancestor and sibling retrieval logic"
  key_links:
    - from: "src/utils/ai.ts"
      to: "Gemini API"
      via: "@google/generative-ai SDK"
---

<objective>
Setup the foundational AI infrastructure including the Gemini API client and the DAG-aware context retrieval logic.

Purpose: Provide the AI with the necessary conversation history (ancestors and siblings) to generate relevant responses.
Output: A functional AI client and repository methods for tree traversal.
</objective>

<execution_context>
@/Users/personal/.gemini/get-shit-done/workflows/execute-plan.md
</execution_context>

<context>
@.planning/phases/phase-2/Phase2-CONTEXT.md
@.planning/phases/phase-2/RESEARCH.md
@src/db/repository.ts
@src/types/index.ts
</context>

<tasks>

<task type="auto">
  <name>Task 1: Setup Gemini Client & Environment</name>
  <files>.env.example, src/utils/ai.ts</files>
  <action>
    - Add `VITE_GEMINI_API_KEY` to `.env.example`.
    - Create `src/utils/ai.ts` and initialize the `GoogleGenerativeAI` client using the environment variable.
    - Export a `genAI` instance and a `getModel` helper (defaulting to gemini-1.5-flash).
    - Note: Use `@google/generative-ai` library.
  </action>
  <verify>Check that `src/utils/ai.ts` exports the client and model correctly.</verify>
  <done>Gemini SDK is configured and ready for use.</done>
</task>

<task type="auto">
  <name>Task 2: Implement Context Retrieval in Repository</name>
  <files>src/db/repository.ts</files>
  <action>
    - Add `getAIContext(projectId: string, nodeId: string)` to `projectRepository`.
    - Logic:
      1. Find the target node.
      2. Traverse parents up to the Root (node with no parent edge).
      3. Select Root + 3 most recent ancestors.
      4. Find the immediate parent of the target node.
      5. Fetch siblings of the target node (other children of the same parent).
      6. Return a list of nodes ordered by creation time.
    - Use Dexie queries for efficiency.
  </action>
  <verify>Mock nodes in a test or dev script and verify `getAIContext` returns the correct lineage.</verify>
  <done>Repository can retrieve appropriate context for any node in the tree.</done>
</task>

<task type="auto">
  <name>Task 3: Implement Prompt Formatter</name>
  <files>src/utils/ai.ts</files>
  <action>
    - Add `formatPrompt(contextNodes: NoteTreeNode[])` utility.
    - Convert nodes into the format required by Gemini's `startChat({ history })`.
    - Map `user` nodes to `user` role and `ai` nodes to `model` role.
    - Handle edge cases where context might be empty.
  </action>
  <verify>Unit test or console log with dummy data to ensure roles and parts are correctly mapped.</verify>
  <done>Context nodes are correctly formatted for the Gemini API.</done>
</task>

</tasks>

<success_criteria>
- Gemini client is initialized via environment variable.
- Repository provides a `getAIContext` method that follows the "Root + 3 Ancestors + Siblings" rule.
- Prompt formatter correctly translates node data into Gemini API history objects.
</success_criteria>

<output>
After completion, create `.planning/phases/phase-2/phase-2-01-SUMMARY.md`
</output>
