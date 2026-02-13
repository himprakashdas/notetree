---
phase: phase-1
plan: 05
type: execute
wave: 5
depends_on: ["phase-1-04"]
files_modified:
  - src/components/canvas/DeletionModal.tsx
  - src/store/useFlowStore.ts
  - src/components/canvas/ChatNode.tsx
  - src/index.css
autonomous: true
must_haves:
  truths:
    - "Deleting a node shows a prompt with 3 options"
    - "User can delete a node and its entire subtree"
    - "Nodes can be resized by the user"
    - "UI uses Rose/White/Black branding with NoteTree logos"
  artifacts:
    - path: "src/components/canvas/DeletionModal.tsx"
      provides: "Complex deletion UI"
    - path: "notetree-logos/icon-logo.png"
      provides: "Favicon/App Icon"
  key_links:
    - from: "src/store/useFlowStore.ts"
      to: "recursive deletion logic"
      via: "deleteNodeSubtree action"
---

<objective>
Implement advanced node management (recursive deletion, resizing) and apply final visual branding.

Purpose: Polish the user experience and establish the project's visual identity.
Output: Integrated deletion modal, resizable nodes, and themed UI.
</objective>

<execution_context>
@/Users/personal/.gemini/get-shit-done/workflows/execute-plan.md
@/Users/personal/.gemini/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/Phase1-CONTEXT.md
@.planning/phases/phase-1/phase-1-04-SUMMARY.md
</context>

<tasks>

<task type="auto">
  <name>Advanced Node Deletion Logic</name>
  <files>src/components/canvas/DeletionModal.tsx, src/store/useFlowStore.ts</files>
  <action>
    Create DeletionModal with 3 buttons: "Cancel", "Only this node", "Node and all descendants".
    Implement store actions:
    - `deleteNodeOnly`: Remove node and its incoming/outgoing edges. Children remain (orphaned).
    - `deleteNodeAndDescendants`: Recursively find all children of the target node and remove them all.
    Trigger this modal when 'Delete' is pressed or a delete button in the UI is clicked.
  </action>
  <verify>Deleting a parent with 'Descendants' option clears the whole branch.</verify>
  <done>Node lifecycle management respects the tree structure.</done>
</task>

<task type="auto">
  <name>Node Resizing & Visual Polish</name>
  <files>src/components/canvas/ChatNode.tsx, src/index.css</files>
  <action>
    Integrate `NodeResizer` from `@xyflow/react` into ChatNode.
    - Limit resizing to horizontal only (optional) or both.
    - Ensure resizing is saved to DB via the persistence hook.
    Apply final Rose (#F43F5E) accents to buttons and selected states.
    Setup App Icon and Logo in the Gallery and Canvas HUD.
  </action>
  <verify>Nodes show resize handles when selected; UI colors match branding.</verify>
  <done>Visual workspace is polished and professional.</done>
</task>

</tasks>

<verification>
1. Create a tree with multiple branches.
2. Delete a middle node choosing "Node and all descendants". Verify the branch disappears.
3. Resize a node and verify it stays that size after refresh.
4. Verify the Rose color is used for primary actions.
</verification>

<success_criteria>
Complete foundational feature set with polished interactions and branding.
</success_criteria>

<output>
After completion, create `.planning/phases/phase-1/phase-1-05-SUMMARY.md`
</output>
