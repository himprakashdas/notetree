---
phase: phase-1
plan: 04
type: execute
wave: 4
depends_on: ["phase-1-03"]
files_modified:
  - src/components/chat/ChatOverlay.tsx
  - src/store/useFlowStore.ts
  - src/hooks/usePersistence.ts
  - src/db/repository.ts
autonomous: true
must_haves:
  truths:
    - "Clicking a node opens a foreground chat overlay"
    - "Typing in the overlay auto-saves to IndexedDB"
    - "Closing and reopening a project restores all nodes and edges"
  artifacts:
    - path: "src/components/chat/ChatOverlay.tsx"
      provides: "Full-screen node editor"
    - path: "src/hooks/usePersistence.ts"
      provides: "Zustand-to-Dexie sync logic"
  key_links:
    - from: "src/store/useFlowStore.ts"
      to: "src/db/repository.ts"
      via: "debounced sync"
---

<objective>
Implement the chat overlay for node editing and the auto-save persistence logic.

Purpose: Allow users to input content and ensure it is never lost.
Output: Modal editor with blurred background and debounced persistence to Dexie.
</objective>

<execution_context>
@/Users/personal/.gemini/get-shit-done/workflows/execute-plan.md
@/Users/personal/.gemini/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/Phase1-CONTEXT.md
@.planning/phases/phase-1/phase-1-03-SUMMARY.md
</context>

<tasks>

<task type="auto">
  <name>Implement Chat Overlay Modal</name>
  <files>src/components/chat/ChatOverlay.tsx, src/components/canvas/FlowCanvas.tsx</files>
  <action>
    Create ChatOverlay component using a Dialog/Modal primitive.
    - Blur the background canvas when open.
    - Prevent canvas interaction (lock scrolling/panning) while active.
    - Display an 'X' close button.
    - Focus a simple textarea for plain-text editing.
    Trigger overlay open on node click in FlowCanvas.
  </action>
  <verify>Clicking a node opens a modal; background is blurred; 'X' closes it.</verify>
  <done>User can access the content editor for any node.</done>
</task>

<task type="auto">
  <name>Real-time Auto-Save Logic</name>
  <files>src/hooks/usePersistence.ts, src/store/useFlowStore.ts</files>
  <action>
    Create `usePersistence` hook to observe store changes.
    Implement debounced sync:
    - When `node.data.label` changes, wait 300ms then update the node in `db.nodes`.
    - Handle immediate saves for node creation/deletion and position changes (onNodeDragStop).
    Update `useFlowStore` to include an `updateNodeContent` action.
  </action>
  <verify>Typing in the editor triggers DB writes (check DevTools -> IndexedDB); refresh doesn't lose data.</verify>
  <done>Auto-save meets the "every keystroke" requirement without performance lag.</done>
</task>

<task type="auto">
  <name>Project Data Hydration</name>
  <files>src/store/useFlowStore.ts, src/components/project/ProjectGallery.tsx</files>
  <action>
    Implement `loadProjectData` action in useFlowStore.
    - Fetch all nodes and edges for the `activeProjectId` from Dexie.
    - Populate the store state.
    Trigger this action when a project is selected in the Gallery.
    Show a loading spinner/state while data is hydrating.
  </action>
  <verify>Selecting a previously created project from the gallery restores its tree structure and content.</verify>
  <done>NoteTree successfully persists and restores user sessions.</done>
</task>

</tasks>

<verification>
1. Create a tree.
2. Open a node, type "Hello NoteTree", and wait 1 second.
3. Refresh the page.
4. Select the project and verify "Hello NoteTree" is still there.
</verification>

<success_criteria>
Continuous persistence ensures all changes are saved locally in real-time.
</success_criteria>

<output>
After completion, create `.planning/phases/phase-1/phase-1-04-SUMMARY.md`
</output>
