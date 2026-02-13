# Feature Landscape: NoteTree

**Domain:** Tree-based LLM Interface
**Researched:** 2024-05-22

## Table Stakes

Features users expect in a desktop LLM tool.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Branching | Primary value prop. | Medium | Requires robust DAG state management. |
| Pan/Zoom Canvas | Standard for infinite canvases. | Low | Handled by React Flow. |
| Persistence | Users expect to return to their work. | Medium | IndexedDB (Dexie) is required for large trees. |
| Context Inheritance | Sub-topics must know about parents. | High | Requires sliding window algorithm. |

## Differentiators

Features that set NoteTree apart.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Ghosting (Focus Mode) | Reduces cognitive load by dimming irrelevant branches. | Medium | CSS-based implementation with lineage tracking. |
| Semantic Coloring | Visual categorization of different inquiry lines. | Low | Basic node metadata update. |
| Ancestor Summarization | Preserves context while fitting in token limits. | High | Automated summarization of distant ancestors. |
| Branch Folding | Collapses sub-trees to clean up workspace. | Medium | React Flow `hidden` property logic. |

## Anti-Features

Features to explicitly NOT build for MVP.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Branch Merging | Extremely complex logic for context reconciliation. | Keep branches isolated; allow "Copy/Paste" between nodes. |
| Real-time Collaboration | Adds massive backend complexity (CRDTs). | Local-first desktop focus. |
| Mobile App | Canvas interaction is poor on small screens. | Desktop-only focus for MVP. |

## Feature Dependencies

```
Branching → Persistence (Saving nodes)
Persistence → Dexie.js Setup
Branching → Context Inheritance (Passing history to LLM)
Ghosting → Ancestor Traversal Logic
```

## MVP Recommendation

Prioritize:
1. **Branching & Persistence:** The core loop of exploring and saving.
2. **Sliding Window Context:** Essential for long-running investigations.
3. **Ghosting:** Necessary to prevent "Tree Sprawl" fatigue.

Defer: **Ancestor Summarization** (use simple truncation first).

## Sources
- [PRD Requirements](docs/prd.md)
- [LLM Interface Patterns](https://uxdesign.cc/designing-for-ai-the-interface-is-the-algorithm-7e7e2e8e4e8e)
