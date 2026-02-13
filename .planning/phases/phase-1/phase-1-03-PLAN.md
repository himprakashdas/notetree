---
phase: phase-1
plan: 03
type: execute
wave: 3
depends_on: ["phase-1-02"]
files_modified: [src/components/ChatNode.tsx, src/store/useTreeStore.ts, src/hooks/useShortcuts.ts]
autonomous: true

must_haves:
  truths:
    - "Hovering a node shows a plus button"
    - "Clicking plus creates a child node and edge"
    - "Canvas centers on newly created nodes automatically"
  artifacts:
    - path: "src/hooks/useShortcuts.ts"
      provides: "Keyboard shortcut management"
  key_links:
    - from: "src/components/ChatNode.tsx"
      to: "src/store/useTreeStore.ts"
      via: "branchFromNode action"
---

<objective>
Implement the core branching interaction, including the hover UI and auto-pan behavior.

Purpose: Enable the non-linear growth of the conversation tree.
Output: A "plus" button on node hover that creates child nodes and automatically pans the view.
</objective>

<execution_context>
@/Users/personal/.gemini/get-shit-done/workflows/execute-plan.md
@/Users/personal/.gemini/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/Phase1-CONTEXT.md
@.planning/phases/phase-1/phase-1-02-SUMMARY.md
</context>

<tasks>

<task type="auto">
  <name>Branching UI & Logic</name>
  <files>src/components/ChatNode.tsx, src/store/useTreeStore.ts</files>
  <action>
    1. Update `ChatNode.tsx` to show a "+" button on hover.
    2. Implement `branchFromNode` action in `useTreeStore.ts`:
       - Create a new node at an offset from the parent.
       - Create an edge from parent to child.
       - Set `parentId` on the new node.
    3. Connect the "+" button to the `branchFromNode` action.
  </action>
  <verify>Hover over a node, click the "+" button, and verify a child node and edge are created.</verify>
  <done>Users can create child nodes via a hover interaction.</done>
</task>

<task type="auto">
  <name>Auto-Pan & Keyboard Shortcuts</name>
  <files>src/components/Canvas.tsx, src/hooks/useShortcuts.ts</files>
  <action>
    1. Implement "Auto-Pan" logic in `Canvas.tsx`: when a new node is added, use `setCenter` to focus on the new child.
    2. Create `src/hooks/useShortcuts.ts`: Implement `Cmd+Enter` to branch from the currently focused/selected node.
  </action>
  <verify>Verify that branching triggers a smooth transition/pan to the new node. Test `Cmd+Enter` shortcut.</verify>
  <done>Navigation and interaction are enhanced with auto-panning and shortcuts.</done>
</task>

</tasks>

<verification>
Create a lineage of 3-4 nodes. Verify that the canvas pans to each new node. Use `Cmd+Enter` to create a node.
</verification>

<success_criteria>
- Hovering a node reveals a "+" button.
- Clicking "+" creates a connected child node.
- The canvas automatically centers on newly created nodes.
- `Cmd+Enter` triggers branching for the selected node.
</success_criteria>

<output>
After completion, create `.planning/phases/phase-1/phase-1-03-SUMMARY.md`
</output>
