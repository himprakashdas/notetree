---
phase: phase-1
plan: 02
type: execute
wave: 2
depends_on: ["phase-1-01"]
files_modified: [src/components/Canvas.tsx, src/components/ChatNode.tsx, src/App.tsx]
autonomous: true

must_haves:
  truths:
    - "Canvas shows a dot grid"
    - "Root node can be created via Start Chat button"
    - "Nodes use custom Rose/White/Black styling"
  artifacts:
    - path: "src/components/Canvas.tsx"
      provides: "Infinite canvas workspace"
    - path: "src/components/ChatNode.tsx"
      provides: "Custom styled node component"
  key_links:
    - from: "src/components/Canvas.tsx"
      to: "src/store/useTreeStore.ts"
      via: "useTreeStore selector for nodes/edges"
---

<objective>
Implement the React Flow infinite canvas and a custom ChatNode with base styling and resizing capabilities.

Purpose: Establish the visual interface for the conversation tree.
Output: A functional infinite canvas that can render custom nodes and a "Start Chat" root node.
</objective>

<execution_context>
@/Users/personal/.gemini/get-shit-done/workflows/execute-plan.md
@/Users/personal/.gemini/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/Phase1-CONTEXT.md
@.planning/research/ARCHITECTURE.md
@.planning/phases/phase-1/phase-1-01-SUMMARY.md
</context>

<tasks>

<task type="auto">
  <name>Infinite Canvas Setup</name>
  <files>src/components/Canvas.tsx, src/App.tsx</files>
  <action>
    1. Create `Canvas.tsx` using `@xyflow/react`.
    2. Include `Background` (dot grid), `Controls`, and `MiniMap`.
    3. Add a "Fit to View" button in the Controls.
    4. Sync the canvas `nodes` and `edges` with `useTreeStore`.
    5. Disable manual edge drawing.
    6. Implement a "Start Chat" button overlay that appears when the canvas is empty. This button should trigger adding a root node at (0,0).
  </action>
  <verify>Verify the canvas renders with a dot grid and the "Start Chat" button appears on an empty canvas.</verify>
  <done>Canvas is initialized and synced with the Zustand store.</done>
</task>

<task type="auto">
  <name>Custom ChatNode Implementation</name>
  <files>src/components/ChatNode.tsx</files>
  <action>
    1. Create `ChatNode.tsx` as a custom React Flow node.
    2. Apply styling: Fixed initial width, Rose (`#F43F5E`) border/accent, White (`#FFFFFF`) background.
    3. Use `NodeResizer` from `@xyflow/react` to allow user-controlled resizing.
    4. Implement visual distinction for "User" vs "AI" nodes.
    5. Add a simple text preview area that displays the node's content.
  </action>
  <verify>Confirm that nodes can be added, they use the custom styling, and they can be resized by the user.</verify>
  <done>Custom ChatNode is functional with resizing and project-specific styling.</done>
</task>

</tasks>

<verification>
Click "Start Chat", verify a root node appears on the canvas. Try dragging it, resizing it, and using "Fit to View".
</verification>

<success_criteria>
- React Flow canvas is visible with a dot grid.
- "Start Chat" button creates a root node.
- Custom ChatNode reflects the Rose/White/Black branding.
- Nodes are resizable via `NodeResizer`.
</success_criteria>

<output>
After completion, create `.planning/phases/phase-1/phase-1-02-SUMMARY.md`
</output>
