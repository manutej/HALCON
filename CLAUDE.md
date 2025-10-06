# CLAUDE.md - AI Assistant Configuration for HALCON

## Project Overview
HALCON is a cosmic productivity platform combining orbital navigation UI with astrological insights and AI assistance. This project follows strict Test-Driven Development (TDD) methodology.

## Development Workflow Requirements

### 1. ALWAYS Follow TDD Cycle
```
RED → GREEN → REFACTOR
```
- **RED**: Write failing tests first
- **GREEN**: Write minimal code to pass tests
- **REFACTOR**: Improve code while keeping tests green

### 2. Before Writing ANY Code
1. Check if tests exist for the feature
2. If no tests exist, write them first
3. Run tests to ensure they fail
4. Only then implement the feature

### 3. Test Verification Commands
```bash
# Run tests for specific component
npm test -- [component-name].test.ts --watch

# Verify all tests pass
npm run test:verify

# Check coverage (must be >80%)
npm run test:coverage
```

### 4. Component Development Order
1. **Claude SDK Wrapper** (FIRST PRIORITY)
   - Location: `src/lib/claude-sdk-wrapper/`
   - Tests: `src/__tests__/unit/claude-sdk-wrapper.test.ts`
   - Follow architecture in: `requirements/claude-sdk-wrapper-architecture.md`

2. **Core HALCON Components**
   - Orbital Navigation System
   - Astrological Data Integration
   - Graph Visualization
   - UI Components

### 5. File Structure Convention
```
src/
├── lib/
│   └── claude-sdk-wrapper/
│       ├── index.ts
│       ├── types.ts
│       ├── error-handler.ts
│       └── mcp-integration.ts
├── components/
│   ├── orbital-navigation/
│   ├── astrological-dashboard/
│   └── agent-interface/
├── __tests__/
│   ├── unit/
│   ├── integration/
│   └── e2e/
└── test-setup.ts
```

### 6. Testing Requirements
- Unit test coverage: minimum 80%
- All public methods must have tests
- Test error scenarios and edge cases
- Use mocks for external dependencies
- Follow AAA pattern: Arrange, Act, Assert

### 7. Code Quality Standards
- TypeScript strict mode enabled
- ESLint and Prettier configured
- No any types without justification
- Comprehensive JSDoc comments
- Follow functional programming principles where appropriate

### 8. Commit Message Format
```
type(scope): description

- Write test for [feature]
- Implement [feature] to pass test
- Refactor [component] for clarity
```

Types: feat, fix, test, refactor, docs, style, perf

### 9. Development Commands
```bash
# Initial setup
npm install
npm run setup

# Development
npm run dev          # Start dev server
npm run test:watch   # Run tests in watch mode
npm run lint         # Check code quality
npm run typecheck    # TypeScript validation

# Before committing
npm run test:verify  # Run all tests
npm run lint:fix     # Fix linting issues
npm run build        # Ensure build works
```

### 10. Integration Points
- **MCP Servers**: Configure in `mcp-config.json`
- **API Keys**: Use environment variables only
- **Astrological APIs**: Mock in tests, real in production

## Current Development Focus

### Phase 1: Claude SDK Wrapper (Current)
1. ✅ Architecture document created
2. ✅ TDD workflow established
3. ⏳ Write comprehensive test suite
4. ⏳ Implement wrapper following tests
5. ⏳ Integration tests with mock MCP
6. ⏳ Documentation and examples

### Phase 2: Core HALCON Setup
1. Project initialization with Vite + React + TypeScript
2. Testing framework setup (Jest + React Testing Library)
3. Component architecture following atomic design
4. State management with Zustand
5. Styling with Tailwind CSS

### Phase 3: Orbital Navigation
1. Physics engine tests
2. Animation performance tests
3. Interaction handling tests
4. Component implementation
5. Integration with Claude SDK

## Important Notes

1. **Never skip tests** - They are the specification
2. **Test behavior, not implementation** - Tests should survive refactoring
3. **Keep tests simple** - Complex tests indicate design issues
4. **Mock external services** - Tests must run offline
5. **Use semantic HTML** - Accessibility is not optional

## Questions to Ask Before Implementation

1. Have I written tests for this feature?
2. Do the tests clearly define the requirements?
3. Am I writing the minimal code to pass tests?
4. Is the test coverage adequate (>80%)?
5. Will these tests catch regressions?

## Resources

- TDD Workflow: `requirements/test-driven-development-workflow.md`
- Claude SDK Architecture: `requirements/claude-sdk-wrapper-architecture.md`
- System Context: `requirements/system-context.md`
- Dev Context: `requirements/dev-context.md`

Remember: The goal is to build a reliable, maintainable system where every line of code is justified by a test. Quality over speed, always.