# Phase 1 Context: Foundation

## 1. Creation Flow & Interaction
- **Initial State**: A temporary "Start chat" button appears on an empty canvas.
- **Node Branching**: A "+" UI element appears on node hover to create a child. Branching is the only way to create connections (no manual edge drawing).
- **Auto-Pan**: The canvas automatically pans to center a newly created child node.
- **Chat Interface**: Clicking a node opens a foreground chat overlay.
- **Overlay Behavior**: The background tree view is blurred and the canvas is locked (modal) while the chat overlay is active. An `X` button closes the overlay.

## 2. Node Anatomy
- **Physical Traits**: Nodes have a fixed initial "note" width but are user-resizable.
- **Editor**: Simple plain-text area for node content.
- **Visual Distinction**: Clear visual difference between "User" and "AI" nodes (e.g., background shades or icons).
- **Information Density**: Minimal face; no metadata (tokens/timestamps) for the MVP.

## 3. Canvas Control
- **Navigation Utilities**: A "Fit to view" button is required for navigation.
- **Keyboard Shortcuts**: `Delete` for node removal, `Space` for panning, and `Cmd+Enter` (inherited from PRD) for branching.
- **Visual Aids**: A dot-grid background for spatial orientation.

## 4. Persistence & Management
- **Persistence UX**: The app opens to a "Project Gallery" rather than the last session.
- **Auto-Save**: Changes are saved to IndexedDB on every keystroke within the chat overlay.
- **Deletion Logic**: Deleting a node triggers a prompt with three options:
  1. Cancel
  2. Delete only this node (orphaning children)
  3. Delete node and all descendants

## 5. Deferred Ideas (Future Phases)
- Undo/Redo functionality.
- Metadata display on nodes (token counts, etc.).
- Markdown support in nodes.

## 6. Visual Branding
- **Colors**: Primary: `#F43F5E` (Rose), Secondary: `#FFFFFF` (White), Background/Accents: `#000000` (Black).
- **Logos**: Assets are located in `notetree-logos/`.
  - `notetree-logos/Complete-logo.png`: Main logo.
  - `notetree-logos/icon-logo.png`: App icon/favicon.
