# Clean Architecture & Hexagonal Patterns in NoteTree

This document provides guidance on applying Clean Architecture and Hexagonal (Ports and Adapters) patterns to the NoteTree project.

## Core Principles

1.  **Independence of Frameworks:** The architecture does not depend on the existence of some library of feature-laden software. This allows you to use such frameworks as tools, rather than having to cram your system into their limited constraints.
2.  **Testability:** The business rules can be tested without the UI, Database, Web Server, or any other external element.
3.  **Independence of UI:** The UI can change easily, without changing the rest of the system. A Web UI could be replaced with a console UI, for example, without changing the business rules.
4.  **Independence of Database:** You can swap out SQL for NoSQL, or local storage for a cloud database, without affecting business logic.
5.  **Independence of any agency:** In fact, your business rules simply don’t know anything at all about the outside world.

## Layers

### 1. Entities (Domain)
- **What:** Enterprise-wide business rules.
- **Example:** `Node`, `Edge`, `Tree`, `Message`.
- **Logic:** Node validation, tree traversal logic, context inheritance calculations (pure logic).

### 2. Use Cases (Application)
- **What:** Application-specific business rules.
- **Example:** `BranchFromNode`, `SummarizeBranch`, `SendMessageToLLM`, `DeleteNode`.
- **Logic:** Coordinates the flow of data to and from entities, and directs those entities to use their enterprise-wide business rules to achieve the goals of the use case.

### 3. Interface Adapters (Ports & Adapters)
- **What:** Adapters that convert data from the format most convenient for use cases and entities, to the format most convenient for some external agency such as the DB or the Web.
- **Adapters:**
    - **Controllers:** Handle UI events (e.g., button clicks in React) and call Use Cases.
    - **Presenters:** Format data from Use Cases for display in React Flow.
    - **Gateways:** Interfaces for external services (LLM API, LocalStorage).

### 4. Frameworks & Drivers
- **What:** The outermost layer is generally composed of frameworks and tools such as the Database, the Web Framework, etc.
- **Examples:** React, React Flow, Zustand, Axios, OpenAI SDK.

## Hexagonal Specifics (Ports & Adapters)

- **Ports:** Interfaces defined in the **Use Case** layer.
    - *Driving Ports:* Methods exposed by Use Cases for the UI to call.
    - *Driven Ports:* Interfaces for external dependencies (e.g., `ILLMGateway`, `IStorageRepository`).
- **Adapters:** Implementations of Ports in the **Frameworks & Drivers** or **Interface Adapters** layer.
    - *Driving Adapters:* React Components/Hooks calling Use Cases.
    - *Driven Adapters:* `OpenAIGateway`, `BrowserLocalStorageRepository`.

## Implementation in React/Zustand

- **Zustand:** Should be treated as a **Framework & Driver** or an **Interface Adapter** for state persistence. The core logic should reside in Use Case classes/functions, and Zustand should just hold the resulting state.
- **React Flow:** Purely a **Presenter/Driver** for the visual representation. It should not contain business logic.
