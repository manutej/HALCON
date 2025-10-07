import '@testing-library/jest-dom';

// Add custom matchers
expect.extend({
  toHaveMCPResponse(received: any) {
    const pass = received.messages?.some(
      (msg: any) => msg.metadata?.source === 'mcp'
    );

    return {
      pass,
      message: () =>
        pass
          ? `Expected response not to have MCP messages`
          : `Expected response to have MCP messages`,
    };
  },
});

// Global test setup
beforeAll(() => {
  // Set test environment variables
  process.env.NODE_ENV = 'test';
});

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
});

// Suppress console errors in tests (optional)
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
};
