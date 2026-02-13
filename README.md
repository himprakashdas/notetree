# NoteTree: A Contextual Hierarchical Learning Interface

## Problem Statement
Current Large Language Model (LLM) interfaces predominantly employ a linear, session-based conversational model. While effective for simple queries, this paradigm introduces significant cognitive overhead during complex exploratory learning. When a user requires multiple concurrent clarifications or wishes to pursue divergent lines of inquiry stemming from a single response, the linear format forces a sequential approach. This necessitates frequent vertical scrolling to retrieve previous context or return to a "root" topic, leading to contextual fragmentation and a loss of the narrative thread as the depth of inquiry increases.

## Rationale
The NoteTree model is grounded in both cognitive theory and the technical constraints of LLM architectures:

### 1. Cognitive Science: Reducing Split-Attention
NoteTree aligns with **Schema Theory**, allowing learners to build knowledge by attaching new details to a stable core concept. By enabling branching, the user can maintain the "Root" concept visually while diving into a "Leaf" node (sub-topic). This reduces the "Split-Attention Effect" and preserves working memory that would otherwise be spent navigating a linear history.

### 2. LLM Performance: Context Hygiene
Linear chats often suffer from "context drift," where recent minor details bias the model or cause hallucinations when returning to broader topics. NoteTree addresses this through:
*   **Context Isolation:** Independent branches do not pollute each other's context, even when sharing a parent lineage.
*   **Token Efficiency:** Only the relevant lineage (ancestor nodes) is transmitted to the LLM, reducing costs and improving response accuracy by maintaining a high signal-to-noise ratio.

## Core Objectives
*   **Contextual Inheritance & Isolation:** Each child node inherits the explicit context of its lineage while remaining isolated from sibling branches.
*   **Folding & Summarization:** To prevent "Gardening" fatigue, users can collapse complex investigative branches into single, auto-summarized nodes, maintaining a clean workspace.
*   **Visual Breadcrumbs:** A transparent navigation system that shows exactly which context path is being used for the current interaction.
*   **LLM-Agnostic Interface:** A modular wrapper capable of integrating with various LLM providers (e.g., Gemini, OpenAI) through secure authentication or API keys.

## Target Audience
NoteTree is designed for **Deep Learners**—including academic researchers, medical students, and developers—who require high-fidelity organization for complex, multi-layered information retrieval and synthesis.

---
*NoteTree prioritizes the preservation of the user's mental model, allowing for the seamless traversal of complex topics without the constraints of a traditional linear chat history.*
 
