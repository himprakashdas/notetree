---
phase: 1.1
plan: 03
type: execute
wave: 3
depends_on: ["phase-1.1-02"]
files_modified: [src/components/canvas/ChatNode.tsx, src/store/useFlowStore.ts]
autonomous: true

must_haves:
  truths:
    - "AI nodes in thinking state appear translucent (0.5 alpha)"
    - "Long text in nodes is truncated with '...'"
    - "Newly created nodes are automatically centered in the view"
    - "Node resizing is constrained within min (200x80) and max (600x400) limits"
  artifacts:
    - path: "src/components/canvas/ChatNode.tsx"
      provides: "Visual states and truncation"
    - path: "src/store/useFlowStore.ts"
      provides: "Auto-pan logic in node creation"
---

<objective>
Refine node visuals and interaction constraints for Phase 1.1.
This plan implements the "Thinking" state visuals, ensures text truncation works across different node sizes, and refines auto-pan/resizing behavior.

Purpose: Improve the visual feedback and usability of the growing tree.
Output: Polished node components and smoother canvas interactions.
</objective>

<execution_context>
@/Users/personal/.gemini/get-shit-done/workflows/execute-plan.md
@/Users/personal/.gemini/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md
@.planning/phases/phase-1/Phase1-CONTEXT-REFINED.md
@.planning/phases/phase-1.1/phase-1.1-02-SUMMARY.md
@src/components/canvas/ChatNode.tsx
@src/store/useFlowStore.ts
</context>

<tasks>

<task type="auto">
  <name>Task 1: Implement 'Thinking' visuals and text truncation</name>
  <files>src/components/canvas/ChatNode.tsx</files>
  <action>
    - Update `ChatNode` to check for `data.thinking`.
    - Apply `opacity-50` to the node container if it is in thinking state.
    - Implement robust text truncation for the node content:
        - Use CSS line-clamp or a custom logic to ensure text doesn't overflow the flex-grow area.
        - Ensure "..." appears if text is cut off.
        - The truncation should dynamically adjust to the node's current width/height.
  </action>
  <verify>
    - Create an AI node via 'Send' button: verify it appears semi-transparent.
    - Paste a long text into a node: verify it truncates and shows "..." instead of overflowing.
  </verify>
  <done>
    Nodes correctly reflect pending states and handle long content gracefully.
  </done>
</task>

<task type="auto">
  <name>Task 2: Refine resizing constraints and auto-pan logic</name>
  <files>src/components/canvas/ChatNode.tsx, src/store/useFlowStore.ts, src/components/canvas/FlowCanvas.tsx</files>
  <action>
    - Update `NodeResizer` in `ChatNode.tsx` with defined limits: `minWidth={200}`, `minHeight={80}`, `maxWidth={600}`, `maxHeight={400}`.
    - Implement/Refine Auto-Pan in the store or canvas:
        - When `addSiblingNode` or `addAIChildNode` is called, the canvas should automatically center on the newly created node.
        - Use `reactFlow.setCenter` or `reactFlow.fitView` with appropriate padding and duration (800ms) to smoothly move to the new node.
        - Ensure this doesn't conflict with manual panning.
  </action>
  <verify>
    - Try to resize a node below 200px width: it should stop.
    - Try to resize a node above 600px width: it should stop.
    - Create a new node: the canvas should smoothly slide to center the new node.
  </verify>
  <done>
    Canvas feels "magnetic" and predictable, and node sizes are kept within reasonable bounds.
  </done>
</task>

</tasks>

<verification>
- Verify that resizing limits are enforced.
- Verify that the "Thinking" state is visually distinct.
- Verify that auto-panning provides a smooth user experience.
</verification>

<success_criteria>
- AI nodes have a visible "Thinking" state.
- Text overflow is handled via truncation.
- Resizing is constrained.
- Canvas centers on new nodes.
</success_criteria>

<output>
After completion, create `.planning/phases/phase-1.1/phase-1.1-03-SUMMARY.md`
</output>
