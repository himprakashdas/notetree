# Phase 2 Context: Core AI Integration (Branching & Context)

## 1. Context Inheritance (The "Memory")
- **Lineage Scope**: AI receives the direct path back to the root node, plus **siblings of the immediate parent**. This allows the AI to understand alternative paths already explored.
- **Pruning Logic**: Prompt includes the **Root Node** plus the **3 most recent ancestors** (Sliding Window).
- **Format**: Flat chat history using `User:` and `Assistant:` role headers. Nodes are ordered chronologically (oldest to newest).
- **System Prompt**: A single, global system instruction applies to all AI requests within a project.
- **Context Snapshot**: The prompt is locked at the moment "Send" is clicked. Subsequent edits to ancestors do not affect the active AI generation.

## 2. Response Experience
- **Streaming UI**: AI responses stream into the node in real-time to provide immediate visual feedback and a sense of "liveness."
- **Thinking State**: Nodes start at 0.5 opacity with a "Thinking..." indicator. As text streams in, opacity returns to 1.0.
- **Cancellation**: A "Stop" button appears on generating nodes. Clicking it kills the request and **deletes the generating Assistant node**.
- **Sizing & Scrolling**: Nodes have a fixed maximum height and width in the canvas; if text exceeds these bounds, the node becomes scrollable. The **Chat Overlay** remains the primary reading environment for long responses.

## 3. Concurrency & Queueing
- **FIFO Queue**: Requests are processed one-by-one in a First-In-First-Out queue to manage API rate limits and predictable context management.
- **Background Persistence**: If a user returns to the Project Gallery while a generation is active, the request **continues in the background**. Upon completion, the response is saved to IndexedDB.
- **Lifecycle**: Active requests only terminate if explicitly cancelled by the user or if the browser session is closed.

## 4. Error Handling & Constraints
- **Global Feedback**: API errors (rate limits, auth) are shown as **persistent, cancellable floating toasts** in the top-right of the screen.
- **Safety Blocks**: If a response is blocked by safety filters, the Assistant node is kept but displays a "Content Blocked" message.
- **Connectivity**: 
    - Automatic retry (3 times) with exponential backoff if the connection is lost.
    - The node displays a "Retrying in X seconds..." countdown.
    - If all retries fail, a "Connection Lost" toast is shown, and the pending Assistant node is deleted.
- **Token Awareness**: No token counts or context size warnings are displayed to the user for the MVP.
