# Test-Driven Development Workflow for HALCON

## Overview
This document defines the Test-Driven Development (TDD) methodology for the HALCON project, ensuring every component is built with tests first and verified automatically through AI agents before manual verification is required.

## Core TDD Principles

1. **Red-Green-Refactor Cycle**
   - **Red**: Write a failing test that defines desired functionality
   - **Green**: Write minimal code to make the test pass
   - **Refactor**: Improve code quality while keeping tests green

2. **Test First, Code Second**
   - Every feature starts with test specifications
   - Tests define the contract and expected behavior
   - Implementation follows to satisfy the tests

3. **Automated Verification**
   - AI agents run tests automatically during development
   - Continuous Integration runs all tests on every commit
   - Manual verification only after automated tests pass

## TDD Workflow Steps

### Step 1: Define Feature Requirements
```markdown
Feature: Claude SDK Query Method
Requirements:
- Accept a prompt string and optional configuration
- Return formatted query results with messages
- Handle errors gracefully with meaningful messages
- Support streaming responses
- Respect rate limits and timeouts
```

### Step 2: Write Test Specifications
```typescript
// claude-sdk-wrapper.test.ts
describe('ClaudeSDKWrapper', () => {
  describe('query method', () => {
    it('should accept a prompt and return results', async () => {
      // Arrange
      const wrapper = new ClaudeSDKWrapper({ apiKey: 'test-key' });
      const prompt = 'Write a hello world function';
      
      // Act
      const result = await wrapper.query(prompt);
      
      // Assert
      expect(result).toBeDefined();
      expect(result.messages).toBeInstanceOf(Array);
      expect(result.messages.length).toBeGreaterThan(0);
    });
    
    it('should handle configuration options', async () => {
      // Test with specific options
    });
    
    it('should handle API errors gracefully', async () => {
      // Test error scenarios
    });
  });
});
```

### Step 3: Run Tests (Expect Failure)
```bash
npm test -- claude-sdk-wrapper.test.ts
# Expected: All tests fail (red phase)
```

### Step 4: Implement Minimal Code
```typescript
// claude-sdk-wrapper.ts
export class ClaudeSDKWrapper {
  async query(prompt: string, options?: QueryOptions): Promise<QueryResult> {
    // Minimal implementation to pass tests
    return {
      messages: [{ role: 'assistant', content: 'Response' }],
      metadata: { model: 'claude-3', turns: 1 }
    };
  }
}
```

### Step 5: Run Tests (Expect Success)
```bash
npm test -- claude-sdk-wrapper.test.ts
# Expected: All tests pass (green phase)
```

### Step 6: Refactor and Enhance
```typescript
// Improve implementation while keeping tests green
export class ClaudeSDKWrapper {
  private config: ClaudeSDKConfig;
  
  constructor(config: ClaudeSDKConfig) {
    this.config = this.validateConfig(config);
  }
  
  async query(prompt: string, options?: QueryOptions): Promise<QueryResult> {
    // Enhanced implementation with proper error handling,
    // configuration merging, and response formatting
  }
}
```

## Test Categories and Structure

### 1. Unit Tests
Test individual components in isolation

```typescript
// Structure: src/__tests__/unit/[component-name].test.ts
describe('Component Unit Tests', () => {
  beforeEach(() => {
    // Setup mocks and test data
  });
  
  afterEach(() => {
    // Cleanup
  });
  
  it('should test specific functionality', () => {
    // Single responsibility test
  });
});
```

### 2. Integration Tests
Test interactions between components

```typescript
// Structure: src/__tests__/integration/[feature-name].test.ts
describe('Feature Integration Tests', () => {
  it('should integrate multiple components correctly', async () => {
    // Test real component interactions
  });
});
```

### 3. End-to-End Tests
Test complete user workflows

```typescript
// Structure: src/__tests__/e2e/[workflow-name].test.ts
describe('User Workflow E2E Tests', () => {
  it('should complete entire user journey', async () => {
    // Test from user action to final result
  });
});
```

### 4. Performance Tests
Ensure performance requirements are met

```typescript
// Structure: src/__tests__/performance/[component-name].perf.test.ts
describe('Performance Tests', () => {
  it('should render within 16ms', async () => {
    const startTime = performance.now();
    // Perform operation
    const endTime = performance.now();
    expect(endTime - startTime).toBeLessThan(16);
  });
});
```

## Component-Specific Test Requirements

### Claude SDK Wrapper Tests
```typescript
describe('Claude SDK Wrapper', () => {
  // Configuration tests
  describe('configuration', () => {
    it('should validate API key');
    it('should merge default options');
    it('should handle provider-specific configs');
  });
  
  // Query tests
  describe('query operations', () => {
    it('should execute basic queries');
    it('should handle streaming responses');
    it('should respect rate limits');
    it('should retry on transient failures');
  });
  
  // MCP integration tests
  describe('MCP integration', () => {
    it('should add MCP servers');
    it('should route queries to MCP servers');
    it('should handle MCP server failures');
  });
});
```

### Orbital Navigation Tests
```typescript
describe('Orbital Navigation', () => {
  // Physics tests
  describe('orbital physics', () => {
    it('should calculate correct planet positions');
    it('should maintain 60fps animation');
    it('should handle user interactions');
  });
  
  // Interaction tests
  describe('user interactions', () => {
    it('should respond to clicks');
    it('should handle drag gestures');
    it('should support keyboard navigation');
  });
});
```

### Astrological Data Tests
```typescript
describe('Astrological Data', () => {
  // API tests
  describe('API integration', () => {
    it('should fetch current positions');
    it('should cache responses appropriately');
    it('should fall back to cached data');
  });
  
  // Calculation tests
  describe('calculations', () => {
    it('should calculate moon phases');
    it('should detect retrogrades');
    it('should compute house positions');
  });
});
```

## AI Agent Verification Workflow

### 1. Test Execution Command
```bash
# AI agent runs this automatically
npm run test:verify
```

### 2. Test Report Format
```json
{
  "summary": {
    "total": 150,
    "passed": 148,
    "failed": 2,
    "coverage": 92
  },
  "failures": [
    {
      "test": "should handle API timeout",
      "error": "Timeout not properly caught",
      "file": "claude-sdk-wrapper.test.ts:45"
    }
  ],
  "suggestions": [
    "Add timeout handling in query method",
    "Consider implementing exponential backoff"
  ]
}
```

### 3. AI Agent Actions
```typescript
// CLAUDE.md instructions
When implementing features:
1. First run: npm run test:watch [component]
2. Verify all tests are failing (red)
3. Implement minimal code to pass tests
4. Run: npm run test:verify
5. If coverage < 80%, add more tests
6. Refactor while keeping tests green
```

## Testing Tools and Configuration

### Jest Configuration
```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.tsx'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  testMatch: [
    '**/__tests__/**/*.test.{ts,tsx}',
    '**/__tests__/**/*.perf.test.{ts,tsx}'
  ]
};
```

### Testing Libraries
```json
{
  "devDependencies": {
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "@testing-library/user-event": "^14.0.0",
    "@playwright/test": "^1.40.0",
    "jest": "^29.7.0",
    "ts-jest": "^29.1.0",
    "msw": "^2.0.0"
  }
}
```

### Mock Service Worker Setup
```typescript
// src/mocks/handlers.ts
import { rest } from 'msw';

export const handlers = [
  rest.post('/api/claude', (req, res, ctx) => {
    return res(
      ctx.json({
        messages: [{ role: 'assistant', content: 'Mocked response' }]
      })
    );
  }),
  
  rest.get('/api/astrology/current', (req, res, ctx) => {
    return res(
      ctx.json({
        sun: { sign: 'Leo', degrees: 15 },
        moon: { sign: 'Cancer', degrees: 22 }
      })
    );
  })
];
```

## Continuous Integration Setup

### GitHub Actions Workflow
```yaml
# .github/workflows/test.yml
name: Test Suite

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run unit tests
        run: npm run test:unit
        
      - name: Run integration tests
        run: npm run test:integration
        
      - name: Run E2E tests
        run: npm run test:e2e
        
      - name: Check coverage
        run: npm run test:coverage
        
      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
```

## Test-Driven Development Benefits

1. **Clear Requirements**: Tests define exactly what the code should do
2. **Confidence**: Refactoring is safe with comprehensive test coverage
3. **Documentation**: Tests serve as living documentation
4. **Design Quality**: TDD leads to better API design
5. **Reduced Debugging**: Bugs are caught early in development
6. **AI Verification**: Agents can verify functionality automatically

## Best Practices

1. **Keep Tests Simple**: One assertion per test when possible
2. **Use Descriptive Names**: Test names should explain what and why
3. **Arrange-Act-Assert**: Follow AAA pattern consistently
4. **Mock External Dependencies**: Isolate units under test
5. **Test Edge Cases**: Include boundary conditions and error scenarios
6. **Maintain Test Quality**: Refactor tests along with code
7. **Run Tests Frequently**: Use watch mode during development

## Common Testing Patterns

### Testing Async Operations
```typescript
it('should handle async operations', async () => {
  const result = await asyncFunction();
  expect(result).toBeDefined();
});
```

### Testing React Components
```typescript
it('should render component correctly', () => {
  const { getByText, getByRole } = render(<Component />);
  expect(getByText('Expected Text')).toBeInTheDocument();
  
  const button = getByRole('button');
  fireEvent.click(button);
  
  expect(mockHandler).toHaveBeenCalled();
});
```

### Testing State Changes
```typescript
it('should update state correctly', () => {
  const { result } = renderHook(() => useCustomHook());
  
  act(() => {
    result.current.updateValue('new value');
  });
  
  expect(result.current.value).toBe('new value');
});
```

This TDD workflow ensures that HALCON is built with quality and reliability from the ground up, with every component thoroughly tested before implementation.