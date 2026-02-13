---
phase: phase-1
plan: 03
type: execute
wave: 3
depends_on: ["phase-1-02"]
files_modified:
  - src/components/canvas/ChatNode.tsx
  - src/store/useFlowStore.ts
  - src/components/canvas/FlowCanvas.tsx
  - src/hooks/useHotkeys.ts
autonomous: true
must_haves:
  truths:
    - "Hovering a node shows a '+' button"
    - "Clicking '+' creates a child node and pans to it"
    - "User can use Space to pan and Cmd+Enter to branch"
  artifacts:
    - path: "src/hooks/useHotkeys.ts"
      provides: "Keyboard shortcut management"
  key_links:
    - from: "src/components/canvas/ChatNode.tsx"
      to: "src/store/useFlowStore.ts"
      via: "addChildNode action"
---

<objective>
Implement the core branching interaction and canvas navigation helpers.

Purpose: Enable building the tree structure and navigating efficiently.
Output: Hover-based node creation, auto-pan logic, and keyboard shortcuts.
</objective>

<execution_context>
@/Users/personal/.gemini/get-shit-done/workflows/execute-plan.md
@/Users/personal/.gemini/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/Phase1-CONTEXT.md
@.planning/phases/phase-1/phase-1-02-SUMMARY.md
</context>

<tasks>

<task type="auto">
  <name>Node Branching Interaction</name>
  <files>src/components/canvas/ChatNode.tsx, src/store/useFlowStore.ts</files>
  <action>
    Add a "+" button to the ChatNode component that appears on hover.
    Implement `addChildNode` action in useFlowStore:
    - Generate unique ID for new node and edge.
    - Calculate child position with vertical offset (e.g., parent.y + 200) and horizontal jitter or centering.
    - Set child role (alternate: if parent is User, child is AI).
    - Update nodes and edges state.
  </action>
  <verify>Hovering a node shows '+'; clicking it adds a child node connected by an edge.</verify>
  <done>Core "Branching" interaction works as described in the PRD.</done>
</task>

<task type="auto">
  <name>Auto-Pan & Navigation Utilities</name>
  <files>src/components/canvas/FlowCanvas.tsx, src/store/useFlowStore.ts</files>
  <action>
    Integrate `useReactFlow` hook to control viewport.
    Implement auto-pan: When a child is created, call `fitView` or `setCenter` targeting the new node with a smooth duration.
    Add a "Fit to View" floating button in the canvas HUD (bottom-left) using Lucide 'Maximize' icon.
  </action>
  <verify>Creating a child node automatically centers the screen on it; Fit to View button works.</verify>
  <done>Canvas navigation supports the tree growth pattern.</done>
</task>

<task type="auto">
  <name>Canvas Keyboard Shortcuts</name>
  <files>src/hooks/useHotkeys.ts, src/components/canvas/FlowCanvas.tsx</files>
  <action>
    Create a custom hook `useHotkeys` (using native event listeners or a library like react-hotkeys-hook).
    Implement:
    - `Delete`: Delete selected node(s) - simple for now.
    - `Space`: (Built-in to React Flow) ensure it's not blocked.
    - `Cmd+Enter`: If a node is selected, trigger branching (same as clicking '+').
  </action>
  <verify>Cmd+Enter on a selected node creates a child; Delete key removes node.</verify>
  <done>Power users can build the tree via keyboard.</done>
</task>

</tasks>

<verification>
1. Create a root node.
2. Hover the root and click '+'. Verify child node creation and auto-pan.
3. Select a child node and press Cmd+Enter. Verify grandchild creation.
4. Click "Fit to View" to see the whole tree.
</verification>

<success_criteria>
Branching is the primary way to grow the tree, accompanied by smooth camera transitions.
</success_criteria>

<output>
After completion, create `.planning/phases/phase-1/phase-1-03-SUMMARY.md`
</output>
