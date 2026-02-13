# Technology Stack

**Analysis Date:** 2025-02-13

## Languages

**Primary:**
- TypeScript - Planned for all application logic (referenced in `package.json` scripts as `tsc` and TDD Section 2.2).

**Secondary:**
- JavaScript - Likely used for configuration files (e.g., `vite.config.js`).

## Runtime

**Environment:**
- Node.js - Development environment for Vite and build tooling.

**Package Manager:**
- npm - Implied by presence of `package.json`.
- Lockfile: missing - No `package-lock.json` or `yarn.lock` detected in root.

## Frameworks

**Core:**
- React - Planned frontend framework (TDD Section 2.2).
- Vite - Build tool and dev server (referenced in `package.json` scripts).

**Visualization:**
- React Flow - Planned for tree-based canvas rendering (TDD Section 2.2).

**Testing:**
- Not detected - No testing framework listed in `package.json` or TDD.

**Build/Dev:**
- Vite - Build/Dev server.
- TypeScript (`tsc`) - Compiler.

## Key Dependencies

**Critical:**
- `react-flow` (Planned) - Core visualization engine for the hierarchical tree.
- `zustand` (Planned) - State management library for flat state and high-performance updates.

**Infrastructure:**
- `vite` - Development and build tool.

## Configuration

**Environment:**
- Environment variables - Planned for LLM API keys (referenced in `README.md`).

**Build:**
- `package.json` - Basic build scripts defined.

## Platform Requirements

**Development:**
- Node.js and npm/yarn/pnpm.

**Production:**
- Web browser (Desktop focus as per PRD Section 3).

---

*Stack analysis: 2025-02-13*
