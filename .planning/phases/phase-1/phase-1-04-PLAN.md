---
phase: phase-1
plan: 04
type: execute
wave: 4
depends_on: ["phase-1-03"]
files_modified: [src/components/ChatOverlay.tsx, src/components/Canvas.tsx, src/store/useTreeStore.ts]
autonomous: true

must_haves:
  truths:
    - "Clicking a node opens a foreground overlay"
    - "Overlay blurs the background canvas"
    - "Typing in overlay saves to DB on every keystroke"
  artifacts:
    - path: "src/components/ChatOverlay.tsx"
      provides: "Node content editor interface"
  key_links:
    - from: "src/components/ChatOverlay.tsx"
      to: "src/store/useTreeStore.ts"
      via: "updateNodeContent action"
---

<objective>
Create the Chat Overlay modal for editing node content with background blur and auto-save.

Purpose: Provide a focused environment for user input and AI interaction.
Output: A modal overlay that blurs the canvas and allows editing node text with immediate persistence.
</objective>

<execution_context>
@/Users/personal/.gemini/get-shit-done/workflows/execute-plan.md
@/Users/personal/.gemini/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/Phase1-CONTEXT.md
@.planning/phases/phase-1/phase-1-03-SUMMARY.md
</context>

<tasks>

<task type="auto">
  <name>Chat Overlay Component</name>
  <files>src/components/ChatOverlay.tsx, src/components/Canvas.tsx</files>
  <action>
    1. Create `ChatOverlay.tsx`: A fixed-position foreground modal.
    2. Use Tailwind's `backdrop-blur-sm` and a semi-transparent black overlay.
    3. Implement an `X` button to close the overlay.
    4. Update `Canvas.tsx`: Clicking a node should open the overlay.
    5. Ensure the canvas is locked while the overlay is open.
  </action>
  <verify>Click a node, confirm the overlay opens, the background blurs, and the canvas cannot be dragged.</verify>
  <done>Chat Overlay provides a focused, modal editing experience.</done>
</task>

<task type="auto">
  <name>Plain-text Editor & Auto-save</name>
  <files>src/components/ChatOverlay.tsx, src/store/useTreeStore.ts</files>
  <action>
    1. Integrate a simple `<textarea>` in the overlay.
    2. Connect the editor to `useTreeStore`'s `updateNodeContent` action.
    3. Implement auto-save: Every keystroke updates the Zustand state.
    4. Ensure the `ChatNode` updates its preview in real-time.
  </action>
  <verify>Type in the overlay, close it, refresh the page, and verify the content is persisted.</verify>
  <done>Node content is editable and persisted automatically on every keystroke.</done>
</task>

</tasks>

<verification>
Open overlay, type a paragraph, confirm real-time update on the background node, close overlay, refresh page.
</verification>

<success_criteria>
- Chat Overlay blurs the background and locks the canvas.
- Clicking a node opens its respective content in the overlay.
- Text changes are saved to IndexedDB on every keystroke.
- Closing the overlay restores canvas interactivity.
</success_criteria>

<output>
After completion, create `.planning/phases/phase-1/phase-1-04-SUMMARY.md`
</output>
