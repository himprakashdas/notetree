---
phase: 1.1
plan: 01
type: execute
wave: 1
depends_on: []
files_modified: [src/index.css, src/store/useFlowStore.ts, src/components/canvas/FlowCanvas.tsx, src/types/index.ts]
autonomous: true

must_haves:
  truths:
    - "Role Toggle is visible in the top-right corner of the canvas"
    - "Role Toggle successfully switches between 'User' and 'Assistant'"
    - "HUD elements (Back button, Title, Role Toggle) are aligned to viewport corners"
    - "useFlowStore includes addSiblingNode and addAIChildNode actions"
  artifacts:
    - path: "src/store/useFlowStore.ts"
      provides: "Atomic branching logic and nextRole state"
    - path: "src/components/canvas/FlowCanvas.tsx"
      provides: "Dev HUD with Role Toggle"
---

<objective>
Refine the foundational logic and UI grounding for Phase 1.1. 
This plan fixes Tailwind 4 alignment issues, implements a dev-mode Role Toggle, and updates the store with role-specific branching logic (Sibling/AI-child).

Purpose: Establish the atomic turn-based model in the data layer and provide tools for testing it.
Output: Updated store actions, dev-mode HUD toggle, and fixed layout.
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
@src/store/useFlowStore.ts
@src/components/canvas/FlowCanvas.tsx
@src/index.css
</context>

<tasks>

<task type="auto">
  <name>Task 1: Fix Tailwind 4 grounding and misalignments</name>
  <files>src/index.css, src/components/canvas/FlowCanvas.tsx</files>
  <action>
    - Inspect and fix potential misalignment of the FlowCanvas HUD elements (Back button, Title).
    - Ensure the Background grid/dots from @xyflow/react are correctly grounded (aligned with the 0,0 coordinate and spanning the full viewport).
    - Verify Tailwind 4 @theme variables in index.css are correctly picked up by components.
    - Remove any hardcoded heights that might be causing scrollbars or overflow issues in the main canvas container.
  </action>
  <verify>
    - Open the app, go to a project.
    - Check that HUD elements are cleanly aligned to the corners.
    - Check that no unexpected scrollbars appear on the main viewport.
  </verify>
  <done>
    Canvas HUD is perfectly aligned and container fills viewport without overflow.
  </done>
</task>

<task type="auto">
  <name>Task 2: Implement Role Toggle and store state</name>
  <files>src/store/useFlowStore.ts, src/types/index.ts, src/components/canvas/FlowCanvas.tsx</files>
  <action>
    - Add `thinking?: boolean` to `NodeData` interface in `src/types/index.ts`.
    - In `useFlowStore.ts`:
        - Add `nextRole: 'user' | 'ai'` to state, defaulting to 'user'.
        - Add `setNextRole` action.
    - In `FlowCanvas.tsx`:
        - Add a Role Toggle component in the top-right HUD.
        - Style it as a segmented control or toggle switch (User vs Assistant).
        - Use Rose-500 for 'Assistant' and Zinc-500 for 'User' active states.
  </action>
  <verify>
    - Role Toggle appears in the top-right of the canvas.
    - Clicking it toggles between "User" and "Assistant".
    - UI reflects the active choice visually.
  </verify>
  <done>
    Role Toggle is functional and integrated into the canvas HUD.
  </done>
</task>

<task type="auto">
  <name>Task 3: Implement atomic branching actions in store</name>
  <files>src/store/useFlowStore.ts</files>
  <action>
    - Implement `addSiblingNode(nodeId: string)`:
        - Find the parent of the given node (by searching edges where target = nodeId).
        - If parent found, create a new child for THAT parent with the same role as the current node.
        - If no parent found (root), create a new root node with the same role.
        - Offset the new node's X position by 300px (to the side).
    - Implement `addAIChildNode(parentId: string)`:
        - Create a new 'ai' node as a child of parentId.
        - Set `thinking: true` in its data.
        - Position it 200px below the parent.
    - Update `addChildNode` to respect the `nextRole` from the store if it's used as a generic addition.
  </action>
  <verify>
    - Store now has specific methods for Sibling and AI-Child creation.
    - Positional offsets follow the 300px side / 200px below pattern.
  </verify>
  <done>
    Atomic branching logic is implemented in the store and ready for UI integration.
  </done>
</task>

</tasks>

<verification>
- Verify Role Toggle updates the store state.
- Verify `addSiblingNode` and `addAIChildNode` can be called (via console or temporary buttons) and produce the expected node types and positions.
</verification>

<success_criteria>
- Layout is clean and grounded.
- Role Toggle is visible and functional.
- Store supports Sibling and AI-child branching patterns.
</success_criteria>

<output>
After completion, create `.planning/phases/phase-1.1/phase-1.1-01-SUMMARY.md`
</output>
