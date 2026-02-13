---
phase: phase-2
plan: 01
type: execute
wave: 1
depends_on: []
files_modified: [src/types/index.ts, src/db/repository.ts, src/utils/ai.ts]
autonomous: true
user_setup:
  - service: Gemini API
    why: "Required for AI-powered node generation"
    env_vars:
      - name: VITE_GEMINI_API_KEY
        source: "Google AI Studio (https://aistudio.google.com/app/apikey)"

must_haves:
  truths:
    - "Project model includes a global system prompt field"
    - "Context retrieval fetches Root + 3 ancestors + Siblings of immediate parent"
    - "Context nodes are ordered chronologically"
  artifacts:
    - path: "src/types/index.ts"
      provides: "Project interface update"
    - path: "src/db/repository.ts"
      provides: "Advanced context retrieval logic"
  key_links:
    - from: "src/db/repository.ts"
      to: "Dexie nodes/edges tables"
      via: "getAIContext query"
---

<objective>
Update the data layer to support project-level system prompts and implement the specific DAG traversal logic for context inheritance.

Purpose: Provide the AI with a rich, structured memory including alternative exploration paths (uncles).
Output: Updated types and repository methods for context retrieval.
</objective>

<execution_context>
@/Users/personal/.gemini/get-shit-done/workflows/execute-plan.md
</execution_context>

<context>
@.planning/phases/phase-2/Phase2-CONTEXT.md
@.planning/phases/phase-2/RESEARCH.md
@src/types/index.ts
@src/db/repository.ts
</context>

<tasks>

<task type="auto">
  <name>Task 1: Update Project Type and Repository</name>
  <files>src/types/index.ts, src/db/repository.ts, src/db/schema.ts</files>
  <action>
    - Add `systemPrompt: string` to the `Project` interface in `src/types/index.ts`.
    - Update `createProject` in `src/db/repository.ts` to initialize `systemPrompt` (default to an empty string or a generic assistant instruction).
    - Ensure `db.version(1).stores` in `src/db/schema.ts` includes the new field if necessary (Dexie doesn't strictly require it in the store definition unless indexed, but good to check).
  </action>
  <verify>Check that `Project` type has the new field and `createProject` works.</verify>
  <done>Project model supports global system instructions.</done>
</task>

<task type="auto">
  <name>Task 2: Implement Advanced Context Retrieval</name>
  <files>src/db/repository.ts</files>
  <action>
    - Implement `getAIContext(projectId: string, nodeId: string)` in `projectRepository`.
    - Logic:
      1. Find the parent `P` of the target node (where target node is being generated).
      2. Ancestor Path: Traverse up from `P` to find all ancestors.
      3. Pruning: Select the **Root Node** and the **3 most recent ancestors** of `P`.
      4. Uncles/Alternatives: Find all siblings of `P` (nodes sharing the same parent as `P`).
      5. Fetch the `systemPrompt` from the `Project`.
      6. Return unique nodes from Ancestors + Uncles, sorted by `createdAt`.
    - Use Dexie queries for the traversal.
  </action>
  <verify>Verify with mock data that for a node N with parent P, the context includes Root, P's siblings, and P's ancestors.</verify>
  <done>Repository provides the specific "Memory" required by NoteTree's branching model.</done>
</task>

<task type="auto">
  <name>Task 3: Implement Prompt Formatter</name>
  <files>src/utils/ai.ts</files>
  <action>
    - Create `src/utils/ai.ts`.
    - Implement `formatPrompt(systemPrompt: string, contextNodes: NoteTreeNode[])`.
    - Convert `contextNodes` into Gemini `history` objects (`{ role: 'user' | 'model', parts: [{ text: string }] }`).
    - Map `user` nodes to `user` role and `ai` nodes to `model` role.
    - Include the `systemPrompt` as the first message if present.
  </action>
  <verify>Test with dummy nodes to ensure roles are correctly assigned and order is preserved.</verify>
  <done>Context data is correctly formatted for the Gemini SDK.</done>
</task>

</tasks>

<success_criteria>
- Project type supports `systemPrompt`.
- `getAIContext` correctly fetches Root + 3 Ancestors + Uncles.
- Context is sorted chronologically.
</success_criteria>

<output>
After completion, create `.planning/phases/phase-2/phase-2-01-SUMMARY.md`
</output>
