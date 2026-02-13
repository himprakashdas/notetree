---
phase: phase-1
plan: 02
type: execute
wave: 2
depends_on: ["phase-1-01"]
files_modified:
  - src/store/useFlowStore.ts
  - src/components/canvas/FlowCanvas.tsx
  - src/components/canvas/ChatNode.tsx
  - src/App.tsx
autonomous: true
must_haves:
  truths:
    - "User can see a grid-background infinite canvas"
    - "User sees a 'Start chat' button on an empty canvas"
    - "Clicking 'Start chat' creates a root User node"
  artifacts:
    - path: "src/components/canvas/FlowCanvas.tsx"
      provides: "Main React Flow wrapper"
    - path: "src/components/canvas/ChatNode.tsx"
      provides: "Custom node UI"
    - path: "src/store/useFlowStore.ts"
      provides: "React Flow state management"
  key_links:
    - from: "src/components/canvas/FlowCanvas.tsx"
      to: "src/store/useFlowStore.ts"
      via: "React Flow props and Store hooks"
---

<objective>
Setup the React Flow canvas with a custom node type and the initial "Start" state.

Purpose: Provide the visual environment for the tree structure.
Output: Functional infinite canvas with a custom ChatNode and root creation logic.
</objective>

<execution_context>
@/Users/personal/.gemini/get-shit-done/workflows/execute-plan.md
@/Users/personal/.gemini/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/phases/phase-1/RESEARCH.md
@.planning/Phase1-CONTEXT.md
@.planning/phases/phase-1/phase-1-01-SUMMARY.md
</context>

<tasks>

<task type="auto">
  <name>Setup React Flow Store & Canvas</name>
  <files>src/store/useFlowStore.ts, src/components/canvas/FlowCanvas.tsx</files>
  <action>
    Create useFlowStore using Zustand, following the pattern in RESEARCH.md.
    Implement onNodesChange, onEdgesChange, and basic node/edge state.
    Setup FlowCanvas component:
    - ReactFlow component with Background (variant="dots").
    - Integration with useFlowStore.
    - Custom 'chatNode' type mapping.
    - Disable manual edge connections (edgesReconnectable={false}, etc.).
  </action>
  <verify>Canvas renders with a dot grid; zooming and panning works.</verify>
  <done>Infinite canvas is ready for custom nodes.</done>
</task>

<task type="auto">
  <name>Implement ChatNode Component</name>
  <files>src/components/canvas/ChatNode.tsx</files>
  <action>
    Create a custom ChatNode component for React Flow.
    - Fixed initial width (e.g., 250px).
    - Styling for 'user' vs 'ai' roles (User: darker/neutral, AI: subtle color tint or Rose border).
    - Display node content (data.label) in a simple div.
    - Include Handle components (Target on top, Source on bottom).
    - Handle visual selection states.
  </action>
  <verify>Nodes render with distinct styles for user/ai roles.</verify>
  <done>Custom node UI reflects NoteTree's design requirements.</done>
</task>

<task type="auto">
  <name>Empty State & Root Node Creation</name>
  <files>src/components/canvas/FlowCanvas.tsx, src/App.tsx</files>
  <action>
    Implement "Start chat" button overlay for empty canvases.
    - Appears centered when `nodes.length === 0`.
    - Clicking it adds a 'user' ChatNode at (0, 0) and hides the button.
    Ensure FlowCanvas is rendered in App.tsx when a project is active.
    Add a "Back to Gallery" button in a top-left HUD to return to the project list.
  </action>
  <verify>Selecting a project shows the 'Start chat' button; clicking it spawns the first node.</verify>
  <done>Initial entry into the canvas allows starting a new tree.</done>
</task>

</tasks>

<verification>
1. Select a project from the gallery.
2. Verify "Start chat" button appears.
3. Click "Start chat" and verify a node appears at the center.
4. Zoom and pan around the node.
</verification>

<success_criteria>
User can enter a project, see an infinite canvas, and create the first node.
</success_criteria>

<output>
After completion, create `.planning/phases/phase-1/phase-1-02-SUMMARY.md`
</output>
