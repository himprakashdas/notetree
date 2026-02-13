# Research Summary: NoteTree

**Domain:** Tree-based LLM Exploratory Learning Interface
**Researched:** 2024-05-22
**Overall confidence:** HIGH

## Executive Summary

NoteTree is a desktop-first application designed to solve "linear chat fatigue" by providing a non-linear, branching canvas for LLM interactions. The research confirms that a combination of **React Flow** (for visualization), **Zustand** (for state), and **Dexie.js** (for persistence) is the most performant and maintainable stack for this domain.

The core challenge lies in managing **Context Inheritance** and **UI Scalability**. To address this, the project will implement a "Sliding Window" strategy (Root + Last N Ancestors) and a "Focus Mode" (Ghosting inactive branches). Performance is optimized through viewport virtualization and flat-map state structures that prevent cascading re-renders.

## Key Findings

**Stack:** @xyflow/react (React Flow) + Zustand + Dexie.js + tiktoken.
**Architecture:** Clean Hexagonal architecture with a flat DAG state map.
**Critical pitfall:** Avoiding sibling context pollution and managing IndexedDB serialization overhead.

## Implications for Roadmap

Based on research, the suggested phase structure is:

1. **Phase 1: Core Canvas & DAG State**
   - Implement the `TreeStore` in Zustand with flat mapping.
   - Setup React Flow with custom `ChatNode` and `onlyRenderVisibleElements`.
   - Implement basic branching and persistence with Dexie.
   - *Rationale:* Establishes the foundation for all other features.

2. **Phase 2: Intelligent Context & LLM**
   - Implement `ContextEngine` with `tiktoken`.
   - Create the "Sliding Window" lineage traversal algorithm.
   - Integrate OpenAI/Gemini adapters.
   - *Rationale:* Core utility that makes the branching actually useful.

3. **Phase 3: Workspace Optimization**
   - Implement "Focus Mode" (Ghosting) via CSS selectors.
   - Add "Branch Folding" to manage tree sprawl.
   - *Rationale:* Prevents cognitive overload as the tree grows.

4. **Phase 4: Advanced Refinement**
   - Implement "Ancestor Summarization" for distant nodes.
   - Add semantic coloring and export features.

**Research flags for phases:**
- Phase 2: Requires precise token counting logic; logic needs to be robust against "Root" node size.
- Phase 3: "Ghosting" logic performance should be monitored to ensure re-calculating the active lineage doesn't lag on large trees.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Libraries are well-established and fit the requirements perfectly. |
| Features | HIGH | Based on standard LLM patterns and PRD goals. |
| Architecture | HIGH | Clean Architecture + Flat Map is a proven pattern for graph-based apps. |
| Pitfalls | MEDIUM | Most pitfalls are documented, but Dexie serialization at scale may need further profiling. |

## Gaps to Address

- **Large Tree Layouts:** Research into automated layout algorithms (like `dagre` or `elkjs`) might be needed if users want an "Auto-Arrange" feature.
- **Offline Mode:** While local-first, handling edge cases for offline LLM calls (caching/queueing) needs more detail.
- **Multi-Model Context:** Different models have different tokenizers; `tiktoken` works for OpenAI, but Gemini/Anthropic may need alternatives.
