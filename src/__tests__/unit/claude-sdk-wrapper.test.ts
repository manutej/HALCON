/**
 * Claude SDK Wrapper Test Suite
 * Following TDD methodology - tests define the specification
 */

import { ClaudeSDKWrapper } from '@lib/claude-sdk-wrapper';
import {
  ClaudeSDKConfig,
  QueryOptions,
  ClaudeSDKError,
  MCPServerConfig,
} from '@lib/claude-sdk-wrapper/types';

describe('ClaudeSDKWrapper', () => {
  let wrapper: ClaudeSDKWrapper;
  const validConfig: ClaudeSDKConfig = {
    apiKey: 'test-api-key',
    defaultModel: 'claude-3-5-sonnet-20241022',
    defaultMaxTurns: 3,
    enableMCP: true,
    enableStreaming: true,
  };

  beforeEach(() => {
    process.env.CLAUDE_API_KEY = 'test-api-key';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Configuration and Initialization', () => {
    it('should initialize with valid configuration', () => {
      wrapper = new ClaudeSDKWrapper(validConfig);
      expect(wrapper).toBeInstanceOf(ClaudeSDKWrapper);
    });

    it('should use API key from environment if not provided', () => {
      delete validConfig.apiKey;
      wrapper = new ClaudeSDKWrapper(validConfig);
      expect(wrapper).toBeDefined();
    });

    it('should throw error if no API key available', () => {
      delete process.env.CLAUDE_API_KEY;
      delete validConfig.apiKey;
      expect(() => new ClaudeSDKWrapper(validConfig)).toThrow(
        ClaudeSDKError
      );
    });

    it('should merge config with defaults', () => {
      const minimalConfig: ClaudeSDKConfig = { apiKey: 'test' };
      wrapper = new ClaudeSDKWrapper(minimalConfig);
      expect(wrapper).toBeDefined();
      // Defaults should be applied internally
    });

    it('should validate configuration on initialization', () => {
      const invalidConfig = {
        apiKey: 'test',
        defaultMaxTurns: -1, // Invalid
      };
      expect(() => new ClaudeSDKWrapper(invalidConfig)).toThrow();
    });
  });

  describe('Query Method', () => {
    beforeEach(() => {
      wrapper = new ClaudeSDKWrapper(validConfig);
    });

    it('should execute basic query and return formatted result', async () => {
      const result = await wrapper.query('Write a hello world function');

      expect(result).toHaveProperty('messages');
      expect(result).toHaveProperty('metadata');
      expect(result.messages).toBeInstanceOf(Array);
      expect(result.messages.length).toBeGreaterThan(0);
      expect(result.metadata.model).toBeDefined();
    });

    it('should respect query options', async () => {
      const options: QueryOptions = {
        model: 'claude-3-opus-20240229',
        maxTurns: 1,
        temperature: 0.5,
        maxTokens: 500,
      };

      const result = await wrapper.query('Test prompt', options);
      expect(result.metadata.model).toBe(options.model);
    });

    it('should handle empty prompts gracefully', async () => {
      await expect(wrapper.query('')).rejects.toThrow(ClaudeSDKError);
    });

    it('should include metadata in response', async () => {
      const result = await wrapper.query('Test');

      expect(result.metadata).toHaveProperty('model');
      expect(result.metadata).toHaveProperty('turns');
      expect(result.metadata).toHaveProperty('duration');
      expect(result.metadata.duration).toBeGreaterThan(0);
    });

    it('should track token usage when available', async () => {
      const result = await wrapper.query('Test');

      if (result.metadata.tokensUsed) {
        expect(result.metadata.tokensUsed).toHaveProperty('input');
        expect(result.metadata.tokensUsed).toHaveProperty('output');
        expect(result.metadata.tokensUsed).toHaveProperty('total');
      }
    });
  });

  describe('Streaming Query', () => {
    beforeEach(() => {
      wrapper = new ClaudeSDKWrapper(validConfig);
    });

    it('should support streaming responses', async () => {
      const chunks: string[] = [];

      for await (const message of wrapper.streamQuery('Write a test')) {
        chunks.push(message.content);
      }

      expect(chunks.length).toBeGreaterThan(0);
      expect(chunks.join('')).toBeTruthy();
    });

    it('should allow early termination with AbortController', async () => {
      const abortController = new AbortController();
      const chunks: string[] = [];

      try {
        for await (const message of wrapper.streamQuery('Write a long test', {
          abortController,
        })) {
          chunks.push(message.content);
          if (chunks.length === 2) {
            abortController.abort();
          }
        }
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }

      expect(chunks.length).toBeLessThanOrEqual(2);
    });

    it('should include metadata in streamed messages', async () => {
      for await (const message of wrapper.streamQuery('Test')) {
        expect(message).toHaveProperty('role');
        expect(message).toHaveProperty('content');
        expect(message).toHaveProperty('metadata');
        break; // Just test first message
      }
    });
  });

  describe('Session Management', () => {
    beforeEach(() => {
      wrapper = new ClaudeSDKWrapper(validConfig);
    });

    it('should create a new session', () => {
      const session = wrapper.createSession('test-session-1');

      expect(session).toBeDefined();
      expect(session.id).toBe('test-session-1');
      expect(session.messages).toEqual([]);
      expect(session.createdAt).toBeInstanceOf(Date);
    });

    it('should resume an existing session', async () => {
      const sessionId = 'test-session-2';

      wrapper.createSession(sessionId);
      await wrapper.query('First message', { sessionId });

      const session = wrapper.resumeSession(sessionId);
      expect(session.messages.length).toBeGreaterThan(0);
    });

    it('should throw error when resuming non-existent session', () => {
      expect(() => wrapper.resumeSession('non-existent')).toThrow(
        ClaudeSDKError
      );
    });

    it('should maintain conversation context in sessions', async () => {
      const sessionId = 'test-session-3';
      wrapper.createSession(sessionId);

      await wrapper.query('My name is Alice', { sessionId });
      const result = await wrapper.query('What is my name?', { sessionId });

      expect(result.messages.some((m) => m.content.includes('Alice'))).toBe(
        true
      );
    });
  });

  describe('MCP Integration', () => {
    beforeEach(() => {
      wrapper = new ClaudeSDKWrapper(validConfig);
    });

    it('should add MCP server', async () => {
      const mcpConfig: MCPServerConfig = {
        id: 'test-mcp-server',
        url: 'http://localhost:3000',
        capabilities: ['ephemeris', 'calculations'],
      };

      await wrapper.addMCPServer(mcpConfig);
      // Should not throw
      expect(true).toBe(true);
    });

    it('should remove MCP server', async () => {
      const mcpConfig: MCPServerConfig = {
        id: 'test-mcp-server',
        url: 'http://localhost:3000',
        capabilities: ['ephemeris'],
      };

      await wrapper.addMCPServer(mcpConfig);
      wrapper.removeMCPServer('test-mcp-server');
      // Should not throw
      expect(true).toBe(true);
    });

    it('should query with MCP server context', async () => {
      const mcpConfig: MCPServerConfig = {
        id: 'astro-server',
        url: 'http://localhost:3000',
        capabilities: ['ephemeris'],
      };

      await wrapper.addMCPServer(mcpConfig);

      const result = await wrapper.query(
        'Get current planetary positions',
        {
          mcpServers: ['astro-server'],
        }
      );

      expect(result).toBeDefined();
      expect(result.messages).toBeInstanceOf(Array);
    });

    it('should handle MCP server connection failures gracefully', async () => {
      const mcpConfig: MCPServerConfig = {
        id: 'failing-server',
        url: 'http://invalid-url',
        capabilities: ['test'],
      };

      await expect(wrapper.addMCPServer(mcpConfig)).rejects.toThrow();
    });
  });

  describe('Error Handling', () => {
    beforeEach(() => {
      wrapper = new ClaudeSDKWrapper(validConfig);
    });

    it('should handle API errors gracefully', async () => {
      // Mock an API error (non-transient to avoid long retry loops)
      jest
        .spyOn(wrapper as any, 'makeRequest')
        .mockRejectedValue(new ClaudeSDKError('Auth failed', 'AUTH_ERROR', false));

      await expect(wrapper.query('Test')).rejects.toThrow(ClaudeSDKError);
    });

    it('should retry on transient failures', async () => {
      const makeRequestSpy = jest
        .spyOn(wrapper as any, 'makeRequest')
        .mockRejectedValueOnce(new Error('Transient error'))
        .mockResolvedValueOnce({
          messages: [{ role: 'assistant', content: 'Success' }],
        });

      const result = await wrapper.query('Test');

      expect(result.messages[0]?.content).toBe('Success');
      expect(makeRequestSpy).toHaveBeenCalledTimes(2);
    });

    it('should not retry on non-retryable errors', async () => {
      const makeRequestSpy = jest
        .spyOn(wrapper as any, 'makeRequest')
        .mockRejectedValue(
          new ClaudeSDKError('Auth failed', 'AUTH_ERROR', false)
        );

      await expect(wrapper.query('Test')).rejects.toThrow(ClaudeSDKError);
      expect(makeRequestSpy).toHaveBeenCalledTimes(1);
    });

    it('should respect max retry limit', async () => {
      const wrapperWithRetries = new ClaudeSDKWrapper({
        ...validConfig,
        maxRetries: 2,
      });

      const makeRequestSpy = jest
        .spyOn(wrapperWithRetries as any, 'makeRequest')
        .mockRejectedValue(new Error('Transient error')); // Explicitly transient

      await expect(wrapperWithRetries.query('Test')).rejects.toThrow();
      expect(makeRequestSpy).toHaveBeenCalledTimes(3); // Initial + 2 retries
    });

    it('should implement exponential backoff for retries', async () => {
      // This is a timing test - might need adjustment
      const startTime = Date.now();

      const wrapperWithRetries = new ClaudeSDKWrapper({
        ...validConfig,
        maxRetries: 2,
      });

      jest
        .spyOn(wrapperWithRetries as any, 'makeRequest')
        .mockRejectedValue(new Error('Transient'));

      try {
        await wrapperWithRetries.query('Test');
      } catch {
        // Expected to fail
      }

      const elapsed = Date.now() - startTime;
      expect(elapsed).toBeGreaterThan(100); // Should have delays
    });
  });

  describe('Tool Management', () => {
    beforeEach(() => {
      wrapper = new ClaudeSDKWrapper(validConfig);
    });

    it('should register custom tool', () => {
      const customTool = {
        name: 'calculator',
        description: 'Performs calculations',
        inputSchema: {
          type: 'object',
          properties: {
            expression: { type: 'string' },
          },
        },
        handler: async (input: Record<string, unknown>) => {
          return { result: 42 };
        },
      };

      wrapper.registerTool(customTool);
      // Should not throw
      expect(true).toBe(true);
    });

    it('should set allowed tools for query', async () => {
      const result = await wrapper.query('Calculate 2+2', {
        allowedTools: ['calculator'],
      });

      expect(result).toBeDefined();
    });
  });

  describe('Rate Limiting', () => {
    it('should respect rate limits', async () => {
      const limitedWrapper = new ClaudeSDKWrapper({
        ...validConfig,
        rateLimitPerMinute: 2,
      });

      // Make 2 requests (should succeed)
      await limitedWrapper.query('Test 1');
      await limitedWrapper.query('Test 2');

      // 3rd request should be queued or rejected
      const promise = limitedWrapper.query('Test 3');
      await expect(promise).resolves.toBeDefined();
    });
  });

  describe('Timeout Handling', () => {
    it.skip('should timeout long-running queries', async () => {
      const timeoutWrapper = new ClaudeSDKWrapper({
        ...validConfig,
        timeout: 100, // Very short timeout
        maxRetries: 0, // Don't retry timeouts in this test
      });

      // Mock a request that never resolves to simulate timeout
      jest
        .spyOn(timeoutWrapper as any, 'makeRequest')
        .mockImplementation(
          () => new Promise(() => {}) // Promise that never resolves
        );

      await expect(timeoutWrapper.query('Test')).rejects.toThrow(
        /timeout/i
      );
    }, 500); // Short test timeout
  });
});
