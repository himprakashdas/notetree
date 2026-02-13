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
    - "Role Toggle switches between 'User' and 'Assistant' roles for the next node creation"
    - "Cmd+Enter triggers a branch: AI child for User nodes, User child (Reply) for AI nodes"
  artifacts:
    - path: "src/store/useFlowStore.ts"
      provides: "Atomic branching logic with role-overrides"
    - path: "src/components/canvas/FlowCanvas.tsx"
      provides: "Grounded layout and HUD with Role Toggle"
    - path: "src/hooks/useHotkeys.ts"
      provides: "Context-aware Cmd+Enter branching"
  key_links:
    - from: "src/components/canvas/FlowCanvas.tsx"
      to: "src/store/useFlowStore.ts"
      via: "useFlowStore selector"
      pattern: "useFlowStore\\(.*nextRoleOverride"
    - from: "src/store/useFlowStore.ts"
      to: "src/types/index.ts"
      via: "Type imports"
      pattern: "import type.*NodeData"
    - from: "src/hooks/useHotkeys.ts"
      to: "src/store/useFlowStore.ts"
      via: "Action calls"
      pattern: "useFlowStore\\.getState\\(\\)\\.addBranch"
---

<objective>
Establish the refined foundation for Phase 1.1. This plan fixes Tailwind 4 grounding issues, implements the smart role-based branching logic, and updates keyboard shortcuts to align with the turn-based refinement.

Purpose: Provide the logical and structural grounding for the refined interaction model.
Output: Fixed layout, functional Role Toggle (as override), and context-aware branching hotkeys.
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
  <name>Task 2: Implement Role Toggle and Smart Branching logic</name>
  <files>src/store/useFlowStore.ts, src/types/index.ts, src/components/canvas/FlowCanvas.tsx</files>
  <action>
    - Update `src/types/index.ts`: Add `thinking?: boolean` to `NodeData`.
    - Update `src/store/useFlowStore.ts`:
        - Add `nextRoleOverride: 'user' | 'ai' | null` (default null) and `setNextRoleOverride` action.
        - Implement `addBranch(parentId: string)`:
            - Determine role:
                1. If `nextRoleOverride` is set, use it and then reset override to `null`.
                2. Else if parent node is `ai`, role = `user` (Reply/Completion loop).
                3. Else if parent node is `user`, role = `user` (Sibling default).
            - Position: X+300 if same role, Y+200 if role changed (child).
        - Implement `addAIChild(parentId: string)`: creates an 'ai' child node regardless of toggle, set `thinking: true`, offset Y+200. (Used for explicit 'Send' actions).
    - Update `src/components/canvas/FlowCanvas.tsx`:
        - Add a Role Toggle switch in the top-right HUD (User vs Assistant).
        - Use Rose-500 for Assistant and Zinc-500 for User states.
  </action>
  <verify>
    - Role Toggle appears and updates `nextRoleOverride`.
    - `addBranch` on an AI node creates a User child by default.
    - `addBranch` on a User node creates a User sibling by default.
    - Setting Role Toggle to Assistant and clicking branch on User node creates an AI child.
  </verify>
  <done>
    Role-based state and smart branching logic are implemented.
  </done>
</task>

<task type="auto">
  <name>Task 3: Refine Keyboard Shortcuts (Cmd+Enter)</name>
  <files>src/hooks/useHotkeys.ts</files>
  <action>
    - Update `useHotkeys.ts` to handle `Cmd+Enter` (or `Ctrl+Enter`) based on the selected node's role:
        - If selected node is `user`, call `addAIChild`.
        - If selected node is `ai`, call `addBranch` (which defaults to User child/Reply).
    - Ensure it still prevents default and stops propagation if inside an editor.
  </action>
  <verify>
    - Select a User node, press Cmd+Enter: AI child should appear.
    - Select an AI node, press Cmd+Enter: User child (Reply) should appear.
  </verify>
  <done>
    Keyboard shortcuts align with the refined branching logic.
  </done>
</task>

</tasks>

<verification>
- Check HUD alignment.
- Verify Role Toggle override functionality.
- Verify Cmd+Enter branching behavior for both User and AI nodes.
</verification>

<success_criteria>
- Clean, grounded canvas layout.
- Functional Role Toggle as a creation override.
- Context-aware keyboard branching (User -> AI child, AI -> User child).
</success_criteria>

<output>
After completion, create `.planning/phases/phase-1.1/phase-1.1-01-SUMMARY.md`
</output>
