import { ClaudeAPIClient } from '../../lib/claude-api-client';

describe('ClaudeAPIClient', () => {
  let client: ClaudeAPIClient;
  
  beforeEach(() => {
    // Mock environment variable
    process.env.CLAUDE_API_KEY = 'test-api-key';
    client = new ClaudeAPIClient();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('initialization', () => {
    it('should throw error if API key is not provided', () => {
      delete process.env.CLAUDE_API_KEY;
      expect(() => new ClaudeAPIClient()).toThrow('CLAUDE_API_KEY not found');
    });

    it('should initialize with custom configuration', () => {
      const customClient = new ClaudeAPIClient({
        model: 'claude-3-opus-20240229',
        maxTokens: 2000,
        temperature: 0.5
      });
      expect(customClient).toBeDefined();
    });
  });

  describe('query method', () => {
    it('should send a query and return response', async () => {
      // Mock the HTTP request
      const mockResponse = {
        content: [
          { type: 'text', text: 'Hello from Claude!' }
        ]
      };
      
      // Mock implementation would go here
      jest.spyOn(client as any, 'makeRequest').mockResolvedValue(mockResponse);
      
      const result = await client.query('Say hello');
      expect(result).toBe('Hello from Claude!');
    });

    it('should handle API errors gracefully', async () => {
      // Mock error response
      jest.spyOn(client as any, 'makeRequest').mockRejectedValue(
        new Error('API Error: Invalid request')
      );
      
      await expect(client.query('Test')).rejects.toThrow('API Error');
    });

    it('should respect custom parameters', async () => {
      const mockResponse = {
        content: [{ type: 'text', text: 'Custom response' }]
      };
      
      const makeRequestSpy = jest.spyOn(client as any, 'makeRequest')
        .mockResolvedValue(mockResponse);
      
      await client.query('Test prompt', {
        maxTokens: 500,
        temperature: 0.7
      });
      
      expect(makeRequestSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          max_tokens: 500,
          temperature: 0.7
        })
      );
    });
  });

  describe('streaming', () => {
    it('should support streaming responses', async () => {
      const chunks = ['Hello', ' from', ' Claude!'];
      const mockStream = {
        [Symbol.asyncIterator]: async function* () {
          for (const chunk of chunks) {
            yield { content: [{ type: 'text', text: chunk }] };
          }
        }
      };
      
      jest.spyOn(client as any, 'makeStreamingRequest')
        .mockReturnValue(mockStream);
      
      const results = [];
      for await (const chunk of client.streamQuery('Say hello')) {
        results.push(chunk);
      }
      
      expect(results).toEqual(chunks);
    });
  });

  describe('error handling', () => {
    it('should retry on transient failures', async () => {
      const mockResponse = {
        content: [{ type: 'text', text: 'Success after retry' }]
      };
      
      const makeRequestSpy = jest.spyOn(client as any, 'makeRequest')
        .mockRejectedValueOnce(new Error('Transient error'))
        .mockResolvedValueOnce(mockResponse);
      
      const result = await client.query('Test with retry');
      
      expect(result).toBe('Success after retry');
      expect(makeRequestSpy).toHaveBeenCalledTimes(2);
    });

    it('should not retry on non-transient failures', async () => {
      const makeRequestSpy = jest.spyOn(client as any, 'makeRequest')
        .mockRejectedValue(new Error('Authentication failed'));
      
      await expect(client.query('Test')).rejects.toThrow('Authentication failed');
      expect(makeRequestSpy).toHaveBeenCalledTimes(1);
    });
  });
});