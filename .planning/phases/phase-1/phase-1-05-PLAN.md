---
phase: phase-1
plan: 05
type: execute
wave: 5
depends_on: ["phase-1-04"]
files_modified: [src/components/ProjectGallery.tsx, src/store/useTreeStore.ts, src/components/DeletionPrompt.tsx, src/App.tsx]
autonomous: false
user_setup: []

must_haves:
  truths:
    - "User starts at a Project Gallery view"
    - "Deleting a node shows a prompt with 3 specific options"
    - "Deleting a node and descendants removes the entire subtree"
  artifacts:
    - path: "src/components/ProjectGallery.tsx"
      provides: "Project listing and creation"
    - path: "src/components/DeletionPrompt.tsx"
      provides: "Custom deletion logic UI"
  key_links:
    - from: "src/components/ProjectGallery.tsx"
      to: "src/store/useTreeStore.ts"
      via: "loadProject action"
---

<objective>
Implement the Project Gallery entry point and the advanced node deletion logic.

Purpose: Provide user-facing management of multiple conversation trees and safe node removal.
Output: A gallery view for selecting projects and a multi-option deletion system.
</objective>

<execution_context>
@/Users/personal/.gemini/get-shit-done/workflows/execute-plan.md
@/Users/personal/.gemini/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/Phase1-CONTEXT.md
@.planning/phases/phase-1/phase-1-04-SUMMARY.md
</context>

<tasks>

<task type="auto">
  <name>Project Gallery</name>
  <files>src/components/ProjectGallery.tsx, src/App.tsx</files>
  <action>
    1. Create `ProjectGallery.tsx` as the default view.
    2. Fetch all projects from Dexie and display them as cards.
    3. Include a "New Project" button.
    4. Implement "Open Project" logic.
    5. Add branding using logos in `notetree-logos/`.
  </action>
  <verify>Open the app, confirm the Gallery is shown, and clicking "New Project" opens the canvas.</verify>
  <done>User can manage multiple projects through a gallery interface.</done>
</task>

<task type="auto">
  <name>Advanced Deletion Logic</name>
  <files>src/components/DeletionPrompt.tsx, src/store/useTreeStore.ts</files>
  <action>
    1. Create `DeletionPrompt.tsx`: Modal triggered by `Delete` key.
    2. Implement the three options: Cancel, Delete only this node, Delete node and all descendants.
    3. Implement recursive deletion in `useTreeStore`.
  </action>
  <verify>Create a tree, select a middle node, press Delete, and test all three options.</verify>
  <done>Node deletion handles subtrees correctly per user choice.</done>
</task>

<task type="checkpoint:human-verify">
  <name>Final Phase 1 Verification</name>
  <action>Confirm full integration of Phase 1 features.</action>
  <what-built>Full Phase 1 Foundation: Gallery, Canvas, Branching, Overlay, and Deletion.</what-built>
  <how-to-verify>
    1. Open app, see Gallery.
    2. Create "Test Project".
    3. Add root node via "Start Chat".
    4. Branch 3 nodes deep.
    5. Edit content in Overlay, verify persistence after refresh.
    6. Delete a middle node and choose "Delete descendants" - verify subtree is gone.
    7. Return to Gallery and see the project card.
  </how-to-verify>
  <verify>Type "approved" or describe issues</verify>
  <done>Full phase 1 features are verified and working as expected.</done>
</task>

</tasks>

<verification>
Perform a full end-to-end walkthrough of creating, branching, editing, and deleting a project.
</verification>

<success_criteria>
- App opens to Project Gallery.
- Multiple projects can be created and saved.
- Branching and Auto-Pan feel fluid.
- Deletion prompt correctly manages the DAG structure.
- Logos and branding are applied correctly.
</success_criteria>

<output>
After completion, create `.planning/phases/phase-1/phase-1-05-SUMMARY.md`
</output>
