# Domain Pitfalls: NoteTree

**Domain:** Tree-based LLM Interface
**Researched:** 2024-05-22

## Critical Pitfalls

### Pitfall 1: The "Z-Index" Re-render Trap
**What goes wrong:** Adding one node triggers a re-render of the entire canvas.
**Why it happens:** Passing the entire `nodes` array from Zustand directly to the `<ReactFlow />` component without memoization or stable references.
**Consequences:** Laggy UI when branching, especially at depth > 20.
**Prevention:** Use `useShallow` for the nodes selector and ensure custom nodes are wrapped in `React.memo`.

### Pitfall 2: Context Drift in Branches
**What goes wrong:** A branch about "Python decorators" starts talking about "Recipe for cookies" because the ancestor context is too broad or contains sibling noise.
**Why it happens:** Including sibling nodes in the LLM context.
**Consequences:** Loss of focus, hallucination, and user frustration.
**Prevention:** Strict lineage traversal. A node's context MUST only include direct ancestors, never siblings or cousins.

### Pitfall 3: IndexedDB Serialization Overhead
**What goes wrong:** Saving the state to Dexie causes UI stutters.
**Why it happens:** Serializing a massive JSON object on every keystroke.
**Consequences:** Dropped frames during typing.
**Prevention:** 
1. Throttle/Debounce persistence.
2. Save individual nodes (Delta updates) rather than the whole tree.

## Moderate Pitfalls

### Pitfall 1: Broken Connections during Folding
**What goes wrong:** When a branch is folded, edges point to invisible nodes or disappear.
**Prevention:** Use React Flow's `hidden` property and ensure edges connecting to hidden nodes are also hidden.

### Pitfall 2: Token Limit Overflow
**What goes wrong:** LLM requests fail because the ancestor chain is too long.
**Prevention:** Implement `tiktoken` counting locally and apply the "Root + Sliding Window" strategy before sending the request.

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| Core DAG State | Circular references in tree logic. | Use a Map and validate `parentId` existence. |
| React Flow UI | Overwhelming visual clutter. | Implement "Ghosting" early (Phase 1). |
| LLM Integration | Rate limiting with concurrent branches. | Implement a request queue in the `LLMAdapter`. |

## Sources
- [React Flow Common Issues](https://github.com/xyflow/xyflow/issues)
- [IndexedDB Performance Best Practices](https://web.dev/articles/indexeddb-best-practices)
