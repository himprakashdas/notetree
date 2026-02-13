# Testing Patterns

**Analysis Date:** 2025-02-13

## Test Framework

**Runner:**
- Jest (Planned)
- Config: `jest.config.js` (Planned)

**Assertion Library:**
- Expect (built into Jest)

**Run Commands (Planned):**
```bash
npm test                # Run all tests
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report
```

## Test File Organization

**Location:**
- Co-located with implementation (e.g., `src/domain/NoteTree.test.ts`)

**Naming:**
- `*.test.ts` or `*.test.tsx`

**Structure:**
```
src/
├── domain/
│   ├── NoteTree.ts
│   └── NoteTree.test.ts
├── use-cases/
│   ├── BranchFromNodeUseCase.ts
│   └── BranchFromNodeUseCase.test.ts
```

## Test Structure

**Suite Organization:**
```typescript
describe('ComponentName or ServiceName', () => {
  describe('methodName or featureName', () => {
    it('should perform expected behavior', () => {
      // Arrange
      // Act
      // Assert
    });
  });
});
```

**Patterns:**
- **Arrange-Act-Assert (AAA):** Clearly separate setup, execution, and verification.
- **Given-When-Then:** Used for describe/it naming conventions.

## Mocking

**Framework:** `jest.mock` and `msw` (Mock Service Worker)

**Patterns:**
- Use `msw` for intercepting and mocking LLM API calls in integration tests.
- Use Jest mocks for Port interfaces when testing Use Cases.

```typescript
// Example mocking a Port in a Use Case test
const mockLLMProvider = {
  sendMessage: jest.fn()
};
```

**What to Mock:**
- External APIs (OpenAI, Gemini).
- Browser APIs (localStorage, IndexedDB).
- Complex UI components (React Flow internals) when testing higher-level features.

**What NOT to Mock:**
- Domain Entities (should be pure and tested directly).
- Pure utility functions.

## Fixtures and Factories

**Test Data:**
```typescript
// Example factory for test nodes
const createTestNode = (overrides = {}) => ({
  id: 'test-id',
  content: 'Hello World',
  parentId: null,
  children: [],
  ...overrides
});
```

**Location:**
- `src/tests/fixtures/` or co-located within test files if specific.

## Coverage

**Requirements:**
- 100% Coverage for `src/domain/` (Entities).
- 100% Coverage for `src/use-cases/` (Application logic).
- High coverage for `src/adapters/` (Mapping logic).

**View Coverage:**
```bash
npm run test:coverage
```

## Test Types

**Unit Tests:**
- Scope: Pure functions, Domain entities.
- Focus: Correctness of state transitions and calculations (e.g., sliding window).

**Integration Tests:**
- Scope: Use Cases + Ports (Mocked).
- Focus: Orchestration and error handling.

**Component Tests:**
- Framework: React Testing Library.
- Scope: UI components.
- Focus: User interactions (clicking branch buttons) and correct rendering of the tree state.

**E2E Tests:**
- Framework: Playwright (Future scope).
- Focus: Critical paths (creating a tree, branching multiple times, persistence across reloads).

## Common Patterns

**Async Testing:**
```typescript
it('should handle async responses', async () => {
  const result = await useCase.execute(params);
  expect(result).toBeDefined();
});
```

**Error Testing:**
```typescript
it('should throw domain error when API fails', async () => {
  mockAdapter.failWith(new Error('API Down'));
  await expect(useCase.execute(params)).rejects.toThrow(DomainError);
});
```

---

*Testing analysis: 2025-02-13*
