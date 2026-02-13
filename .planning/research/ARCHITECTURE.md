# Architecture Patterns: NoteTree

**Domain:** Tree-based LLM Interface
**Researched:** 2024-05-22

## Recommended Architecture

NoteTree uses **Clean Hexagonal Architecture** with a **Flat DAG State** in Zustand.

### Component Boundaries

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| `TreeStore` | Source of truth for all nodes and edges. | Dexie, React Components |
| `ContextEngine` | Logic for calculating sliding window and token counts. | `TreeStore`, LLM Adapters |
| `Canvas` | Rendering the visual representation using React Flow. | `TreeStore`, `UIStore` |
| `LLMAdapter` | Normalizing requests to OpenAI/Gemini/Anthropic. | `ContextEngine` |

### Data Flow

1. **User Action:** User clicks "Branch" on a node.
2. **State Update:** `TreeStore` adds a placeholder node.
3. **Context Prep:** `ContextEngine` traverses ancestors up to root, calculates tokens, applies sliding window.
4. **API Call:** `LLMAdapter` sends messages to LLM.
5. **Stream/Result:** Response updates the placeholder node in `TreeStore`.
6. **Persistence:** `TreeStore` triggers Dexie to save the new node.

## Patterns to Follow

### Pattern 1: Flat State Node Map
**What:** Store nodes as a flat object `Record<string, Node>` rather than a nested tree.
**Why:** O(1) lookups, easier serialization, and prevents massive re-renders when a leaf node changes.
**Example:**
```typescript
const useTreeStore = create((set) => ({
  nodes: {},
  addNode: (node) => set((state) => ({ 
    nodes: { ...state.nodes, [node.id]: node } 
  })),
}));
```

### Pattern 2: Selector-Based Focus (Ghosting)
**What:** Use a selector to compute the "Active Lineage" (IDs from root to selected node).
**When:** Whenever a node is clicked or focused.
**Implementation:**
```typescript
const activeLineage = useTreeStore(state => {
  const path = [];
  let curr = state.nodes[state.activeId];
  while (curr) {
    path.push(curr.id);
    curr = state.nodes[curr.parentId];
  }
  return new Set(path);
});
```

### Pattern 3: Materialized Path for DB
**What:** Store the full ancestral path as a string index in Dexie (e.g., `"/root/n1/n2"`).
**Why:** Allows querying all descendants of a node with a single prefix query (`where('path').startsWith('/root/n1')`).

## Anti-Patterns to Avoid

### Anti-Pattern 1: Deeply Nested State
**What:** Storing nodes inside children arrays recursively.
**Why bad:** Updating a deep node requires cloning the entire tree structure above it.
**Instead:** Use the Flat State Node Map.

### Anti-Pattern 2: React Flow State as Source of Truth
**What:** Using `useNodesState` and `useEdgesState` from React Flow as the only state.
**Why bad:** Hard to perform non-UI logic (like context window calculation) without being tied to the UI components.
**Instead:** Keep the Domain State in Zustand and sync it to React Flow.

## Scalability Considerations

| Concern | At 100 nodes | At 1,000 nodes | At 10,000 nodes |
|---------|--------------|--------------|-----------------|
| Rendering | React Flow handles fine. | Enable `onlyRenderVisibleElements`. | Use `Canvas` rendering instead of SVG if needed. |
| State Updates | Zustand handles fine. | Use atomic selectors. | Consider `immer` or manual partial updates. |
| DB Access | Fast. | IndexedDB handles fine. | Implement pagination/lazy loading for subtrees. |

## Sources
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [React Flow Performance](https://reactflow.dev/docs/guides/performance/)
