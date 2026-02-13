---
phase: 1.1
plan: 01
type: execute
wave: 1
depends_on: []
files_modified: [src/index.css, src/store/useFlowStore.ts, src/components/canvas/FlowCanvas.tsx, src/hooks/useHotkeys.ts, src/types/index.ts]
autonomous: true

must_haves:
  truths:
    - "Canvas HUD (Back button, Title, Role Toggle) is correctly aligned to corners"
    - "Role Toggle switches between 'User' and 'Assistant' roles"
    - "Cmd+Enter triggers a branch: AI child for User nodes, Sibling for others (per user decision)"
  artifacts:
    - path: "src/store/useFlowStore.ts"
      provides: "Atomic branching logic and nextRole state"
    - path: "src/components/canvas/FlowCanvas.tsx"
      provides: "Grounded layout and HUD with Role Toggle"
    - path: "src/hooks/useHotkeys.ts"
      provides: "Context-aware Cmd+Enter branching"
---

<objective>
Establish the refined foundation for Phase 1.1. This plan fixes Tailwind 4 grounding issues, implements the role-based state, and updates keyboard shortcuts to align with the new atomic turn-based model.

Purpose: Provide the logical and structural grounding for the refined interaction model.
Output: Fixed layout, functional Role Toggle, and context-aware branching hotkeys.
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
@src/index.css
@src/store/useFlowStore.ts
@src/components/canvas/FlowCanvas.tsx
@src/hooks/useHotkeys.ts
</context>

<tasks>

<task type="auto">
  <name>Task 1: Fix Tailwind 4 grounding and HUD alignment</name>
  <files>src/index.css, src/components/canvas/FlowCanvas.tsx</files>
  <action>
    - Ensure `FlowCanvas.tsx` HUD elements (Back button, Title) use absolute positioning that respects safe areas and alignment.
    - Fix Background grid/dots from `@xyflow/react` to ensure they are correctly grounded to the canvas origin.
    - Verify that no hardcoded heights or weird margins cause layout shifts or unexpected scrollbars.
    - Ensure Tailwind 4 `@theme` variables in `index.css` are properly utilized for branding (Rose-500, Zinc-900).
  </action>
  <verify>
    - Run the app, navigate to a project.
    - Verify HUD elements are pinned to corners.
    - Verify the canvas fills the viewport exactly.
  </verify>
  <done>
    Canvas HUD is perfectly aligned and grounding issues are resolved.
  </done>
</task>

<task type="auto">
  <name>Task 2: Implement Role Toggle and atomic store actions</name>
  <files>src/store/useFlowStore.ts, src/types/index.ts, src/components/canvas/FlowCanvas.tsx</files>
  <action>
    - Update `src/types/index.ts`: Add `thinking?: boolean` to `NodeData`.
    - Update `src/store/useFlowStore.ts`:
        - Add `nextRole: 'user' | 'ai'` (default 'user') and `setNextRole` action.
        - Implement `addSiblingNode(nodeId: string)`: creates a sibling node of the SAME role, offset X+300.
        - Implement `addAIChildNode(parentId: string)`: creates an 'ai' child node, set `thinking: true`, offset Y+200.
    - Update `src/components/canvas/FlowCanvas.tsx`:
        - Add a Role Toggle switch in the top-right HUD (User vs Assistant).
        - Use Rose-500 for Assistant and Zinc-500 for User active states.
  </action>
  <verify>
    - Role Toggle appears and updates store state.
    - Store methods for sibling and AI-child exist and produce correct positions.
  </verify>
  <done>
    Role-based state and atomic branching logic are implemented.
  </done>
</task>

<task type="auto">
  <name>Task 3: Refine Keyboard Shortcuts (Cmd+Enter)</name>
  <files>src/hooks/useHotkeys.ts</files>
  <action>
    - Update `useHotkeys.ts` to handle `Cmd+Enter` (or `Ctrl+Enter`) based on the selected node's role:
        - If selected node is `type === 'user'`, call `addAIChildNode`.
        - If selected node is `type === 'ai'`, call `addSiblingNode` (or appropriate logical continuation).
    - Ensure it still prevents default and stops propagation if inside an editor.
  </action>
  <verify>
    - Select a User node, press Cmd+Enter: AI child should appear.
    - Select an AI node, press Cmd+Enter: Sibling AI node (or User child if preferred) should appear. 
  </verify>
  <done>
    Keyboard shortcuts align with the refined branching logic.
  </done>
</task>

</tasks>

<verification>
- Check HUD alignment.
- Verify Role Toggle functionality.
- Verify Cmd+Enter branching behavior.
</verification>

<success_criteria>
- Clean, grounded canvas layout.
- Functional Role Toggle.
- Context-aware keyboard branching.
</success_criteria>

<output>
After completion, create `.planning/phases/phase-1.1/phase-1.1-01-SUMMARY.md`
</output>
