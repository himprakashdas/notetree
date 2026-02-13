# Phase 1: Foundation - Research

**Researched:** 2024-12-18
**Domain:** Infinite Canvas, Graph State Management, Local Persistence
**Confidence:** HIGH

<user_constraints>
## User Constraints (from Phase1-CONTEXT.md)

### Locked Decisions
- **Creation Flow & Interaction**:
    - Initial State: A temporary "Start chat" button appears on an empty canvas.
    - Node Branching: A "+" UI element appears on node hover to create a child. Branching is the only way to create connections (no manual edge drawing).
    - Auto-Pan: The canvas automatically pans to center a newly created child node.
    - Chat Interface: Clicking a node opens a foreground chat overlay.
    - Overlay Behavior: The background tree view is blurred and the canvas is locked (modal) while the chat overlay is active. An `X` button closes the overlay.
- **Node Anatomy**:
    - Physical Traits: Nodes have a fixed initial "note" width but are user-resizable.
    - Editor: Simple plain-text area for node content.
    - Visual Distinction: Clear visual difference between "User" and "AI" nodes (e.g., background shades or icons).
    - Information Density: Minimal face; no metadata (tokens/timestamps) for the MVP.
- **Canvas Control**:
    - Navigation Utilities: A "Fit to view" button is required for navigation.
    - Keyboard Shortcuts: `Delete` for node removal, `Space` for panning, and `Cmd+Enter` for branching.
    - Visual Aids: A dot-grid background for spatial orientation.
- **Persistence & Management**:
    - Persistence UX: The app opens to a "Project Gallery" rather than the last session.
    - Auto-Save: Changes are saved to IndexedDB on every keystroke within the chat overlay.
    - Deletion Logic: Deleting a node triggers a prompt with three options:
      1. Cancel
      2. Delete only this node (orphaning children)
      3. Delete node and all descendants
- **Visual Branding**:
    - Colors: Primary: `#F43F5E` (Rose), Secondary: `#FFFFFF` (White), Background/Accents: `#000000` (Black).
    - Logos: Assets are located in `notetree-logos/`.

### Claude's Discretion
- Implementation details for the integration of React Flow, Zustand, and Dexie.js.
- Choice of specific libraries for icons (recommended: Lucide) and IDs (recommended: nanoid).
- Project directory structure.

### Deferred Ideas (OUT OF SCOPE)
- Undo/Redo functionality.
- Metadata display on nodes (token counts, etc.).
- Markdown support in nodes.
</user_constraints>

## Summary

This research establishes the foundational stack for NoteTree Phase 1. The core architecture relies on **@xyflow/react** (React Flow 12) for the canvas, **Zustand** for transient application state, and **Dexie.js** for persistent local storage in IndexedDB. 

The primary challenge is maintaining synchronization between the highly reactive React Flow state and the persistent Dexie storage, especially given the "save on every keystroke" requirement. We recommend a pattern where Zustand acts as the "source of truth" for the UI, with a debounced persistence layer that writes specific node/edge updates to Dexie to ensure performance while meeting the auto-save constraint.

**Primary recommendation:** Use `@xyflow/react` (v12) with a custom Zustand store that manages both graph elements and project-level metadata, utilizing a "dirty-check" or debounced observer pattern to sync changes to Dexie.js tables.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `@xyflow/react` | 12.3.x | Infinite Canvas / Graph UI | Industry standard for React-based node editors; powerful API for viewport control and custom nodes. |
| `zustand` | 5.0.x | State Management | Lightest and most performant way to manage external state for React Flow; used internally by React Flow. |
| `dexie` | 4.0.x | IndexedDB Persistence | Simplifies IndexedDB with a clean API, support for compound indexes, and high performance for local-first apps. |
| `typescript` | 5.x | Type Safety | Essential for managing complex graph data structures and store actions. |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|--------------|
| `nanoid` | 5.0.x | ID Generation | Generating unique, URL-friendly IDs for nodes and edges. |
| `lucide-react`| 0.400+  | Icons | Standard, high-quality icon set for UI elements like "+", "X", and "Fit to view". |
| `clsx` / `tailwind-merge` | latest | CSS Class Management | Essential for dynamic styling (e.g., Rose primary color transitions). |
| `date-fns` | latest | Date Handling | For project creation and modification timestamps. |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Zustand | Redux Toolkit | Redux is too verbose for this use case; React Flow's internal Zustand usage makes external Zustand more natural. |
| Dexie.js | LocalStorage | LocalStorage has 5MB limits; NoteTree trees can grow large and contain significant text data. |
| Dexie.js | SQLite (WASM) | Overkill for Phase 1; Dexie is easier to setup and perfectly handles JS object storage. |

**Installation:**
```bash
npm install @xyflow/react zustand dexie lucide-react nanoid clsx tailwind-merge date-fns
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── components/
│   ├── canvas/          # React Flow components (Nodes, Edges, Custom UI)
│   ├── chat/            # Chat Overlay and Editor components
│   ├── project/         # Project Gallery and Management
│   └── shared/          # Buttons, Modals, UI primitives
├── db/
│   ├── schema.ts        # Dexie database definition
│   └── repository.ts    # DB access patterns (CRUD)
├── hooks/
│   ├── useFlowSync.ts   # Synchronization logic between Store and DB
│   └── useHotkeys.ts    # Canvas-specific keyboard shortcuts
├── store/
│   ├── useFlowStore.ts  # Main Zustand store for the graph
│   └── useAppStore.ts   # UI state (overlays, active project)
├── types/               # Shared TypeScript interfaces
└── utils/               # Helpers (ID generation, positioning)
```

### Pattern 1: Targeted Debounced Persistence
Instead of persisting the entire state object (which grows linearly with nodes), use a "targeted" approach:
1.  **Zustand Store** handles the "Live" state.
2.  **Actions** (e.g., `updateNodeData`) update Zustand.
3.  **Persistence Layer** observes specific changes:
    *   `node.data` changes (keystrokes) -> Debounce (300-500ms) -> `db.nodes.put()`.
    *   `node.position` changes (drag end) -> Immediate -> `db.nodes.put()`.
    *   `node` created/deleted -> Immediate -> `db.nodes.add()` / `db.nodes.delete()`.

### Anti-Patterns to Avoid
- **Saving Viewport on Every Pan:** React Flow viewport changes many times per second during zoom/pan. Only save viewport on "Project Close" or use low-frequency throttling.
- **Direct Dexie calls in Components:** Components should only talk to the Zustand store. Let a central sync logic handle the database.
- **Manual Edge Drawing:** The PRD specifies branching is the *only* way to create edges. Do not enable React Flow's default edge connection handles.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Graph UI | Custom SVG/Canvas | React Flow | Handles zoom, pan, node selection, and handles out-of-the-box. |
| IndexedDB API | Raw `indexedDB` | Dexie.js | Raw API is notoriously difficult and error-prone for transactions. |
| Positioning | Manual layouting | Simple Tree Logic | Since it's a tree (parent -> child), child position = `parent.x + offset`. |
| Modal/Overlay | Custom logic | Headless UI / Radix | Accessibility (ARIA) and focus trapping for the Chat Overlay are hard to get right. |

**Key insight:** React Flow 12 (@xyflow/react) is highly optimized for performance with large numbers of nodes; trying to build a custom canvas will inevitably lead to performance bottlenecks and re-inventing the wheel for zoom/pan logic.

## Common Pitfalls

### Pitfall 1: React Flow Internal vs External State
**What goes wrong:** React Flow maintains its own internal state for nodes and edges. If you update the external Zustand store incorrectly, they can get out of sync, leading to "ghost nodes" or UI glitches.
**How to avoid:** Always use the `onNodesChange` and `onEdgesChange` callbacks provided by React Flow to update your Zustand store.

### Pitfall 2: Race Condition on Load
**What goes wrong:** React Flow might mount before the data has finished loading from Dexie, resulting in an empty canvas or errors.
**How to avoid:** Use a `loading` state in your store. Don't render the `ReactFlow` component until the data is hydrated from Dexie.

### Pitfall 3: Auto-Pan Conflict
**What goes wrong:** `fitView` or `setCenter` might conflict with user's manual panning if triggered at the wrong time.
**How to avoid:** Only trigger auto-pan on *explicit* creation events, and use the `duration` parameter for a smooth transition that feels intentional.

## Code Examples

### Dexie Schema for NoteTree
```typescript
// src/db/schema.ts
import Dexie, { type EntityTable } from 'dexie';
import { Node, Edge } from '@xyflow/react';

interface Project {
  id: string;
  name: string;
  createdAt: number;
  lastModified: number;
}

const db = new Dexie('NoteTreeDB') as Dexie & {
  projects: EntityTable<Project, 'id'>;
  nodes: EntityTable<Node & { projectId: string }, 'id'>;
  edges: EntityTable<Edge & { projectId: string }, 'id'>;
};

db.version(1).stores({
  projects: 'id, lastModified',
  nodes: 'id, projectId',
  edges: 'id, projectId, [projectId+id]'
});

export { db };
```

### Zustand Store Integration
```typescript
// src/store/useFlowStore.ts
import { create } from 'zustand';
import { applyNodeChanges, applyEdgeChanges, NodeChange, EdgeChange } from '@xyflow/react';

const useFlowStore = create((set, get) => ({
  nodes: [],
  edges: [],
  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  // ... other actions
}));
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `reactflow` package | `@xyflow/react` | July 2024 | Major performance boost, better SSR support, and clean API. |
| `localStorage` | `IndexedDB` (Dexie) | - | Essential for offline-first and heavy data apps. |
| `react-draggable` | React Flow | - | Abstracted complexity for canvas-based apps. |

**Deprecated/outdated:**
- **React Flow v11**: Use `@xyflow/react` (v12) instead.
- **Redux for Graphs**: React Flow's architecture is now optimized for atomic updates (Zustand/Signals).

## Open Questions

1. **How to handle "Delete only this node (orphaning children)"?**
   - What we know: The PRD requires this option.
   - What's unclear: In a tree, if a parent is gone, do children connect to the grandparent, or just float?
   - Recommendation: Usually, orphaning implies they remain at their position but lose their incoming edge.

2. **Auto-save "Every Keystroke" performance?**
   - What we know: Dexie is fast, but keystrokes are faster.
   - Recommendation: Use a 300ms debounce on the actual DB write to prevent blocking the UI thread on heavy typing.

## Sources

### Primary (HIGH confidence)
- [xyflow.com](https://xyflow.com/docs/react) - Official React Flow 12 Documentation.
- [dexie.org](https://dexie.org/docs/Tutorial/React) - Official Dexie + React guide.
- [zustand-demo.pmnd.rs](https://zustand-demo.pmnd.rs/) - Zustand state management patterns.

### Secondary (MEDIUM confidence)
- [WebSearch: react flow center on node after creation 2024]
- [WebSearch: zustand persist custom storage dexie example]

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Core libraries are stable and widely used in this combination.
- Architecture: HIGH - The Zustand + Dexie pattern is a proven standard for offline-first React apps.
- Pitfalls: MEDIUM - Synchronization edge cases always vary by implementation.

**Research date:** 2024-12-18
**Valid until:** 2025-01-18 (30 days)
