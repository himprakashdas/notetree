---
name: tdd-generator
description: Generates a Technical Design Document (TDD) from a Product Requirements Document (PRD). It enforces Clean Architecture and Hexagonal (Ports and Adapters) patterns. Use when transitioning from requirements (docs/prd.md) to technical planning.
---

# TDD Generator

## Overview
This skill automates the creation of a Technical Design Document (TDD) based on a PRD (typically located at `docs/prd.md`). It ensures that the resulting architecture follows industry best practices, specifically Clean Architecture and Hexagonal patterns, making the codebase maintainable, testable, and decoupled from external frameworks.

## Workflow

1.  **Read the PRD:** Load the content of `docs/prd.md` to understand the product goals, user stories, and functional requirements.
2.  **Consult Architectural Guidelines:** Reference `references/clean_hexagonal.md` for specific guidance on how to map these requirements to Clean Architecture layers.
3.  **Apply TDD Template:** Use the structure provided in `assets/tdd_template.md` as the foundation for the new document.
4.  **Generate TDD:** Synthesize the information into a comprehensive TDD.
5.  **Save Output:** Write the final document to `docs/tdd.md`.

## Guidelines for TDD Generation

- **Entities Layer:** Focus on the core logic of the tree and nodes. Ensure no dependencies on React or external libraries here.
- **Use Cases:** Map each high-priority user story from the PRD to a specific Use Case (e.g., US.1 -> `BranchFromNodeUseCase`).
- **Hexagonal Ports:** Define clear interfaces for the LLM communication and local storage.
- **Visuals:** Include Mermaid diagrams for:
    - The Dependency Rule (pointing inwards towards Entities).
    - Sequence diagrams for the LLM request flow.
    - The Tree Data Model structure.

## Resources

### references/
- **clean_hexagonal.md**: Detailed mapping of Clean Architecture and Hexagonal patterns to the NoteTree project.

### assets/
- **tdd_template.md**: The standard structure for NoteTree TDDs.
