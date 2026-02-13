---
phase: 1.1
plan: 02
type: execute
wave: 2
depends_on: ["phase-1.1-01"]
files_modified: [src/components/canvas/ChatNode.tsx]
autonomous: true

must_haves:
  truths:
    - "Hovering a node reveals an action bar at the bottom"
    - "Clicking Trash icon triggers the deletion modal for that node"
    - "Clicking Plus icon creates a sibling node of same role"
    - "Clicking Send icon (user nodes only) creates an AI child node"
  artifacts:
    - path: "src/components/canvas/ChatNode.tsx"
      provides: "Triple-Action Hover Bar UI and wiring"
---

<objective>
Implement the Triple-Action Hover Bar on nodes for rapid branching and management.
This plan replaces the single "Plus" button with a Delete/Plus/Send bar that appears on hover.

Purpose: Provide the primary interactive interface for building and managing the tree.
Output: Integrated hover action bar in ChatNode.tsx.
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
@.planning/phases/phase-1.1/phase-1.1-01-SUMMARY.md
@src/components/canvas/ChatNode.tsx
</context>

<tasks>

<task type="auto">
  <name>Task 1: Implement Triple-Action Hover Bar UI</name>
  <files>src/components/canvas/ChatNode.tsx</files>
  <action>
    - Replace the existing `Plus` button at the bottom of `ChatNode` with a bar containing three icons:
        - Trash2 (Lucide): Left, styled for danger (hover:text-red-500).
        - Plus (Lucide): Center, styled for sibling creation (hover:text-white).
        - Send (Lucide): Right, styled for AI response (hover:text-rose-500).
    - Styling:
        - The bar should be centered at the bottom, slightly overlapping the node border.
        - Only show 'Send' if `data.type === 'user'`.
        - Add a background (Zinc-800), border (Zinc-700), and shadow.
        - Transition opacity from 0 to 100 on group hover of the node.
  </action>
  <verify>
    - Hovering a node reveals the bar.
    - User nodes show three icons (Delete, Plus, Send).
    - Assistant nodes show two icons (Delete, Plus).
  </verify>
  <done>
    Hover bar UI is implemented and correctly positioned on nodes.
  </done>
</task>

<task type="auto">
  <name>Task 2: Wire Hover Bar actions to store</name>
  <files>src/components/canvas/ChatNode.tsx</files>
  <action>
    - Import and use actions from `useFlowStore`: `setDeletingNodeId`, `addSiblingNode`, `addAIChildNode`.
    - Wire Delete icon to `setDeletingNodeId(id)`.
    - Wire Plus icon to `addSiblingNode(id)`.
    - Wire Send icon to `addAIChildNode(id)`.
    - Ensure `e.stopPropagation()` is called on all clicks to prevent selecting/opening the node editor.
  </action>
  <verify>
    - Clicking Trash icon opens the Deletion Modal for that node.
    - Clicking Plus icon creates a sibling node of the same role.
    - Clicking Send icon (on user nodes) creates a child assistant node.
  </verify>
  <done>
    Hover bar actions are fully functional and connected to the store.
  </done>
</task>

</tasks>

<verification>
- Verify all three icons trigger their respective actions correctly.
- Verify the 'Send' icon is appropriately hidden/shown based on node role.
</verification>

<success_criteria>
- Nodes feature a hoverable action bar.
- Deletion, Sibling creation, and AI Child creation are accessible from the bar.
</success_criteria>

<output>
After completion, create `.planning/phases/phase-1.1/phase-1.1-02-SUMMARY.md`
</output>
