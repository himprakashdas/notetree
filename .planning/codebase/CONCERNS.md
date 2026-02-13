# Codebase Concerns

**Analysis Date:** 2025-02-13

## Tech Debt

**Bootstrap Gap:**
- Issue: Extensive architectural planning exists in `docs/tdd.md`, but zero implementation is present in the codebase. There is no `src` directory or entry point.
- Files: Root directory
- Impact: High risk of the implementation diverging from the planned Clean Architecture if the initial setup is not handled carefully.
- Fix approach: Initialize the project structure following the layers defined in `ARCHITECTURE.md`.

**Incomplete Package Manifest:**
- Issue: `package.json` contains scripts for `vite` and `tsc` but lacks these (and all other) dependencies in `devDependencies` or `dependencies`.
- Files: `package.json`
- Impact: Build and development scripts will fail out-of-the-box.
- Fix approach: Run `npm install --save-dev vite typescript` and add other planned dependencies like `react`, `react-flow`, and `zustand`.

## Known Bugs

**No Source Code:**
- Symptoms: The project cannot be run or built.
- Files: Entire repository
- Trigger: Running `npm run dev` or `npm run build`.
- Workaround: None. Implementation phase has not started.

## Security Considerations

**Local API Key Storage:**
- Risk: The PRD and TDD propose storing LLM API keys in `localStorage`. While this avoids a backend, it exposes keys to any script running on the same origin (XSS risk).
- Files: `docs/prd.md`, `docs/tdd.md` (Planned)
- Current mitigation: None.
- Recommendations: Implement clear warnings about key storage, provide a "Clear Keys" button, and consider using more secure options like `SessionStorage` for temporary use or exploring `IndexedDB` with encryption if persistent storage is required.

## Performance Bottlenecks

**Large Tree Rendering:**
- Problem: Rendering 100+ nodes in a non-linear tree can lead to performance degradation in React.
- Files: `docs/prd.md` (Planned)
- Cause: SVG/DOM node overhead in complex DAGs.
- Improvement path: Ensure the implementation strictly uses React Flow's viewport virtualization as planned in `docs/tdd.md`.

## Fragile Areas

**Context Window Logic:**
- Files: `src/domain/context-logic.ts` (Planned)
- Why fragile: Sliding window calculations with token counting are prone to off-by-one errors and can lead to LLM request failures if limits are exceeded.
- Safe modification: Unit test this logic extensively before integrating with API adapters.
- Test coverage: 0% (No tests exist).

## Missing Critical Features

**Project Infrastructure:**
- Problem: Basic development environment configuration is missing.
- Blocks: Development cannot begin without these.
- Missing:
    - `tsconfig.json`
    - `vite.config.ts`
    - `.eslintrc` / Prettier config
    - Testing framework setup (e.g., `vitest.config.ts`)

**Source Entry Points:**
- Problem: No `index.html` or `src/main.tsx` exists.
- Blocks: App cannot be mounted.

## Test Coverage Gaps

**Entire Codebase:**
- What's not tested: Everything.
- Files: `src/` (Missing)
- Risk: No verification of domain logic or use cases.
- Priority: High. Establish testing patterns (Vitest/Jest) as per `TESTING.md` during the first implementation phase.

---

*Concerns audit: 2025-02-13*
