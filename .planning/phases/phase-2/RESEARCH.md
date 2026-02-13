# Phase 2: Core AI Integration - Research

**Researched:** 2024-05-24
**Domain:** AI Streaming, Context Management, FIFO Queuing
**Confidence:** HIGH

## Summary
The research concludes that the `@google/generative-ai` SDK is the primary tool for streaming Gemini responses. A robust FIFO queue should be implemented using a Zustand store to manage concurrency and rate limits. Context inheritance (Root + 3 Ancestors + Siblings) can be efficiently retrieved from Dexie.js by traversing the `edges` table. Background persistence is achieved by managing the generation process at the store level rather than the component level, coupled with Zustand's `persist` middleware.

**Primary recommendation:** Implement a centralized `AIProvider` or Zustand-based service that manages the `AbortController` and FIFO queue, ensuring generations continue even if the specific node component unmounts.

## User Constraints (from CONTEXT.md)

### Locked Decisions
- AI receives direct path to root + siblings of immediate parent.
- Pruning: Root + 3 most recent ancestors.
- Nodes are ordered chronologically (User: / Assistant:).
- Streaming UI with "Thinking..." state (0.5 opacity).
- FIFO Queue for all requests.
- Background persistence (generation continues if user leaves project).
- Automatic retry (3 times) with exponential backoff.

### Claude's Discretion
- Choice of streaming library (Gemini SDK vs Vercel AI SDK).
- Specific implementation of the FIFO queue and retry logic.

## Standard Stack

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @google/generative-ai | ^0.11.0 | Gemini API SDK | Official SDK; supports streaming and chat history natively. |
| Zustand | ^4.5.0 | Queue & State | Best for global async state and persistence. |
| Dexie.js | ^4.0.0 | DAG Queries | Fast IndexedDB queries for node/edge relationships. |

## Architecture Patterns

### FIFO Queue with Zustand
- **Mechanism**: Use a `queue` array in `useFlowStore` or a dedicated `useAIStore`. 
- **Trigger**: `enqueue` action adds a request and checks if `isProcessing` is false; if so, it starts `processNext`.
- **Background**: By running the loop in the store, the generation is decoupled from the React component lifecycle.

### Context Retrieval Algorithm
1. **Find Ancestors**: Given node $N$, query `edges` where `target == N`. Get `source`. Repeat up to 3 times. Always fetch the node where `parentId` is null (Root).
2. **Find Siblings**: Get `parentId`. Query `edges` where `source == parentId`. All `targets` (excluding $N$) are siblings.
3. **Ordering**: Sort by `createdAt` or use the edge sequence to ensure logical conversation flow.

## Don't Hand-Roll

| Problem | Use Instead | Why |
|---------|-------------|-----|
| Streaming chunks | `result.stream` | Built-in async iterator handles buffer joining. |
| Persistence | `persist` middleware | Handles localStorage/IndexedDB sync automatically. |
| Exponential Backoff | `p-retry` or simple loop | Standardizes delay intervals (1s, 2s, 4s). |

## Common Pitfalls

### Pitfall 1: Aborted Streams in Background
**What goes wrong:** If the user closes the tab or the browser throttles background JS, the stream might fail.
**How to avoid:** Use `IndexedDB` to save partial chunks frequently so progress isn't lost on crash.

### Pitfall 2: Safety Filter Blocks
**What goes wrong:** Gemini might block a response midway. The stream iterator will throw or return a `finishReason: 'SAFETY'`.
**How to avoid:** Check `candidate.finishReason` in every chunk. Display the "Content Blocked" message immediately.

## Code Examples

### Basic Streaming Implementation
```typescript
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function streamResponse(prompt, history, onChunk) {
  const chat = model.startChat({ history });
  const result = await chat.sendMessageStream(prompt);
  for await (const chunk of result.stream) {
    const chunkText = chunk.text();
    onChunk(chunkText);
  }
}
```

### Context Formatting
```typescript
const history = [
  { role: "user", parts: [{ text: rootNode.content }] },
  ...ancestors.map(n => ({ 
    role: n.type === 'user' ? 'user' : 'model', 
    parts: [{ text: n.content }] 
  }))
];
```
