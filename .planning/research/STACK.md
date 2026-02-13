# Technology Stack: NoteTree

**Project:** NoteTree
**Researched:** 2024-05-22
**Confidence:** HIGH

## Recommended Stack

### Core Framework
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| React | 18+ | UI Library | Industry standard, massive ecosystem for tree visualizations. |
| TypeScript | 5+ | Type Safety | Essential for managing complex DAG structures and API responses. |

### Visualization & Interaction
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| React Flow | 11+ | Infinite Canvas | Built-in virtualization, highly customizable nodes/edges, handles DAGs well. |
| @xyflow/react | Latest | Successor to React Flow | More performant, better support for modern React features. |

### State Management
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Zustand | 4.5+ | Global State | Minimal boilerplate, high performance with atomic selectors, built-in persistence middleware. |

### Database & Persistence
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Dexie.js | 4+ | IndexedDB Wrapper | Simplifies IndexedDB usage, supports transactions, easy to index `parentId` for tree traversal. |

### LLM & Context Management
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| tiktoken / js-tiktoken | Latest | Token Counting | Authoritative token counting for OpenAI models to manage sliding window limits. |
| OpenAI SDK | Latest | LLM Access | Standard interface for GPT models. |

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Visualization | React Flow | D3.js | D3 has a steeper learning curve and requires more manual DOM management compared to React Flow's component-based approach. |
| Visualization | React Flow | Cytoscape.js | Cytoscape is great for graph theory but less "React-native" in its rendering cycle. |
| State | Zustand | Redux Toolkit | Redux is too verbose for this project's flat DAG structure; Zustand's atomic updates are better for canvas performance. |
| Persistence | Dexie.js | LocalStorage | LocalStorage has a 5MB limit, which will be quickly exceeded by large conversation trees. |

## Installation

```bash
# Core & State
pnpm add zustand @xyflow/react dexie

# LLM Utilities
pnpm add tiktoken js-tiktoken openai

# Types
pnpm add -D @types/react @types/react-dom
```

## Sources
- [React Flow Performance Docs](https://reactflow.dev/docs/guides/performance/)
- [Zustand Documentation](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [Dexie.js Best Practices](https://dexie.org/docs/Tutorial/Best-Practices)
- [tiktoken npm](https://www.npmjs.com/package/tiktoken)
