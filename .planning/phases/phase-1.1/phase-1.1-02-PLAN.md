---
phase: 1.1
plan: 02
type: execute
wave: 2
depends_on: ["phase-1.1-01"]
files_modified: [src/components/canvas/ChatNode.tsx, src/components/chat/ChatOverlay.tsx]
autonomous: true

must_haves:
  truths:
    - "Hovering a node reveals a triple-icon bar (Delete, Plus, Send)"
    - "Clicking 'Send' in ChatOverlay creates an AI child and closes the overlay"
    - "'Send' icon only appears on User nodes"
  artifacts:
    - path: "src/components/canvas/ChatNode.tsx"
      provides: "Triple-Action Hover Bar"
    - path: "src/components/chat/ChatOverlay.tsx"
      provides: "Actionable editor with Send button"
---

<objective>
Implement the primary interaction UI for rapid tree growth. This plan introduces the Triple-Action Hover Bar on nodes and refines the Chat Overlay with an immediate 'Send' action.

Purpose: Streamline the "Turn-based" creation flow.
Output: Hover action bar on nodes and Send button in Overlay.
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
@src/components/chat/ChatOverlay.tsx
</context>

<tasks>

<task type="auto">
  <name>Task 1: Implement Triple-Action Hover Bar</name>
  <files>src/components/canvas/ChatNode.tsx</files>
  <action>
    - Replace the single Plus button with a centered Hover Bar (Zinc-800, border-Zinc-700) containing:
        - Trash2 (Left): Wire to `setDeletingNodeId`.
        - Plus (Center): Wire to `addSiblingNode`.
        - Send (Right, User only): Wire to `addAIChildNode`.
    - Ensure the bar only appears on node hover (`group-hover:opacity-100`).
    - Use `e.stopPropagation()` on all icon clicks.
  </action>
  <verify>
    - Hover node: Bar appears.
    - Click icons: Verify respective actions trigger.
    - Check that Send only shows for User nodes.
  </verify>
  <done>
    Hover bar is functional and correctly styled.
  </done>
</task>

<task type="auto">
  <name>Task 2: Add Send button to ChatOverlay</name>
  <files>src/components/chat/ChatOverlay.tsx</files>
  <action>
    - Add a "Send" button to the `ChatOverlay` footer (right-aligned).
    - Style it with Rose-500 background if the current node is User.
    - Behavior: Clicking Send should call `addAIChildNode(editingNodeId)` and then `setEditingNodeId(null)` immediately.
    - Ensure it is only enabled if the node has content.
  </action>
  <verify>
    - Open overlay on a User node.
    - Type content, click Send.
    - Verify overlay closes and an AI child node is created.
  </verify>
  <done>
    ChatOverlay allows immediate branching and closure via Send button.
  </done>
</task>

</tasks>

<verification>
- Verify hover bar visibility and actions.
- Verify Overlay Send button creates child and closes overlay.
</verification>

<success_criteria>
- Rapid branching is possible via hover bar.
- Overlay flow is efficient with immediate send/close.
</success_criteria>

<output>
After completion, create `.planning/phases/phase-1.1/phase-1.1-02-SUMMARY.md`
</output>
