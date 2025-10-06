# Claude SDK Wrapper Architecture

## Purpose
Create an independent, reusable Claude Code SDK wrapper component that can be integrated into HALCON and other systems. This wrapper provides a clean, testable interface for AI-powered coding assistance with support for Model Context Protocol (MCP) extensions.

## Core Design Principles
1. **Platform Independence**: Can be used in any TypeScript/JavaScript project
2. **Testability**: Every method has corresponding unit and integration tests
3. **Extensibility**: Support for custom tools and MCP servers
4. **Error Resilience**: Graceful degradation and retry mechanisms
5. **Type Safety**: Full TypeScript support with comprehensive types

## Architecture Overview

```typescript
// Core wrapper interface
interface ClaudeSDKWrapper {
  // Initialize with configuration
  constructor(config: ClaudeSDKConfig);
  
  // Core query method
  query(prompt: string, options?: QueryOptions): Promise<QueryResult>;
  
  // Streaming query for real-time responses
  streamQuery(prompt: string, options?: QueryOptions): AsyncGenerator<Message>;
  
  // Session management
  createSession(sessionId: string): Session;
  resumeSession(sessionId: string): Session;
  
  // MCP integration
  addMCPServer(server: MCPServer): void;
  removeMCPServer(serverId: string): void;
  
  // Tool management
  registerTool(tool: CustomTool): void;
  setAllowedTools(tools: string[]): void;
}
```

## Component Structure

### 1. Core Wrapper (`claude-sdk-wrapper.ts`)
```typescript
export class ClaudeCodeWrapper implements ClaudeSDKWrapper {
  private config: ClaudeSDKConfig;
  private sessions: Map<string, Session>;
  private mcpServers: Map<string, MCPServer>;
  private customTools: Map<string, CustomTool>;
  
  constructor(config: ClaudeSDKConfig) {
    this.validateConfig(config);
    this.config = this.mergeWithDefaults(config);
    this.sessions = new Map();
    this.mcpServers = new Map();
    this.customTools = new Map();
  }
  
  async query(prompt: string, options?: QueryOptions): Promise<QueryResult> {
    try {
      const messages = [];
      for await (const message of this.streamQuery(prompt, options)) {
        messages.push(message);
      }
      return this.formatQueryResult(messages);
    } catch (error) {
      return this.handleQueryError(error);
    }
  }
  
  async *streamQuery(prompt: string, options?: QueryOptions): AsyncGenerator<Message> {
    const mergedOptions = this.mergeOptions(options);
    const queryOptions = this.buildQueryOptions(prompt, mergedOptions);
    
    try {
      for await (const message of query(queryOptions)) {
        yield this.processMessage(message);
      }
    } catch (error) {
      yield this.createErrorMessage(error);
    }
  }
}
```

### 2. Configuration Types (`types.ts`)
```typescript
export interface ClaudeSDKConfig {
  // Authentication
  apiKey?: string;
  provider?: 'anthropic' | 'bedrock' | 'vertex';
  
  // Defaults
  defaultModel?: string;
  defaultMaxTurns?: number;
  defaultSystemPrompt?: string;
  
  // Features
  enableMCP?: boolean;
  enableStreaming?: boolean;
  enableCaching?: boolean;
  
  // Limits
  maxRetries?: number;
  timeout?: number;
  rateLimitPerMinute?: number;
}

export interface QueryOptions {
  model?: string;
  maxTurns?: number;
  systemPrompt?: string;
  allowedTools?: string[];
  temperature?: number;
  sessionId?: string;
  abortController?: AbortController;
}
```

### 3. MCP Integration (`mcp-integration.ts`)
```typescript
export class MCPIntegration {
  private servers: Map<string, MCPServer>;
  
  async addServer(config: MCPServerConfig): Promise<void> {
    const server = await this.connectToServer(config);
    this.servers.set(config.id, server);
  }
  
  async queryWithMCP(prompt: string, serverId: string): Promise<MCPResponse> {
    const server = this.servers.get(serverId);
    if (!server) throw new Error(`MCP server ${serverId} not found`);
    
    return server.query(prompt);
  }
}
```

### 4. Error Handling (`error-handler.ts`)
```typescript
export class ErrorHandler {
  private retryConfig: RetryConfig;
  
  async withRetry<T>(
    operation: () => Promise<T>,
    context: string
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 0; attempt < this.retryConfig.maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        if (!this.isRetryable(error)) throw error;
        await this.delay(this.calculateBackoff(attempt));
      }
    }
    
    throw new ClaudeSDKError(`Failed after ${this.retryConfig.maxRetries} attempts: ${context}`, lastError);
  }
}
```

## Testing Strategy

### Unit Tests
```typescript
describe('ClaudeCodeWrapper', () => {
  describe('query', () => {
    it('should return formatted query result', async () => {
      const wrapper = new ClaudeCodeWrapper({ apiKey: 'test' });
      const result = await wrapper.query('Write a test');
      expect(result).toHaveProperty('messages');
      expect(result).toHaveProperty('metadata');
    });
    
    it('should handle errors gracefully', async () => {
      const wrapper = new ClaudeCodeWrapper({ apiKey: 'invalid' });
      const result = await wrapper.query('Write a test');
      expect(result.error).toBeDefined();
    });
  });
});
```

### Integration Tests
```typescript
describe('ClaudeCodeWrapper Integration', () => {
  it('should work with MCP servers', async () => {
    const wrapper = new ClaudeCodeWrapper({ enableMCP: true });
    await wrapper.addMCPServer({
      id: 'test-server',
      url: 'http://localhost:3000',
      capabilities: ['ephemeris', 'calculations']
    });
    
    const result = await wrapper.query('Get current planetary positions', {
      mcpServers: ['test-server']
    });
    
    expect(result.messages).toContainMCPResponse();
  });
});
```

## Usage Examples

### Basic Usage
```typescript
import { ClaudeCodeWrapper } from '@halcon/claude-sdk-wrapper';

const claude = new ClaudeCodeWrapper({
  apiKey: process.env.ANTHROPIC_API_KEY,
  defaultMaxTurns: 3
});

const result = await claude.query('Implement a fibonacci function');
console.log(result.messages);
```

### Advanced Usage with MCP
```typescript
const claude = new ClaudeCodeWrapper({
  apiKey: process.env.ANTHROPIC_API_KEY,
  enableMCP: true
});

// Add astrological data MCP server
await claude.addMCPServer({
  id: 'astro-server',
  url: 'mcp://astrology.halcon.app',
  capabilities: ['ephemeris', 'natal-charts', 'transits']
});

// Query with MCP context
const result = await claude.query(
  'What are the current planetary positions and their productivity implications?',
  {
    mcpServers: ['astro-server'],
    systemPrompt: 'You are an astrologically-aware productivity assistant'
  }
);
```

### Streaming Usage
```typescript
const claude = new ClaudeCodeWrapper({ enableStreaming: true });

for await (const message of claude.streamQuery('Build a React component')) {
  console.log(message.content);
  // Update UI in real-time
}
```

## Integration with HALCON

### 1. Astrological Context Integration
```typescript
class HALCONClaudeIntegration {
  private claude: ClaudeCodeWrapper;
  private astroContext: AstrologicalContext;
  
  async queryWithCosmicContext(prompt: string): Promise<QueryResult> {
    const cosmicData = await this.astroContext.getCurrentData();
    
    const enhancedPrompt = `
      ${prompt}
      
      Current Cosmic Context:
      - Sun in ${cosmicData.sunSign}
      - Moon in ${cosmicData.moonSign}
      - Retrograde planets: ${cosmicData.retrogrades.join(', ')}
      - Favorable for: ${cosmicData.favorableActivities}
    `;
    
    return this.claude.query(enhancedPrompt, {
      systemPrompt: 'You are a cosmically-aware AI assistant for the HALCON productivity system'
    });
  }
}
```

### 2. Orbital Navigation Assistant
```typescript
class OrbitalNavigationAssistant {
  private claude: ClaudeCodeWrapper;
  
  async getNavigationAdvice(
    currentPlanet: Planet,
    userIntent: string
  ): Promise<NavigationAdvice> {
    const result = await this.claude.query(
      `User is on ${currentPlanet.name} (${currentPlanet.domain}) and wants to: ${userIntent}. 
       Suggest the best planetary domain and tools.`,
      {
        systemPrompt: 'You understand the HALCON orbital navigation system',
        allowedTools: ['navigation-advisor']
      }
    );
    
    return this.parseNavigationAdvice(result);
  }
}
```

## Security Considerations

1. **API Key Management**
   - Never expose API keys in client-side code
   - Use environment variables or secure key management services
   - Implement server-side proxy for production

2. **Rate Limiting**
   - Implement client-side rate limiting
   - Track usage per session/user
   - Queue requests when approaching limits

3. **Input Validation**
   - Sanitize all user inputs
   - Limit prompt length
   - Filter sensitive information

4. **Error Messages**
   - Never expose internal errors to users
   - Log detailed errors server-side
   - Return user-friendly error messages

## Performance Optimization

1. **Caching Strategy**
   - Cache common queries and responses
   - Implement TTL for different query types
   - Use session-based caching for context

2. **Streaming Optimization**
   - Use streaming for long responses
   - Implement chunking for better UX
   - Allow early termination

3. **Connection Pooling**
   - Reuse MCP connections
   - Implement connection health checks
   - Graceful reconnection logic

## Future Enhancements

1. **Multi-Model Support**
   - Support for different Claude models
   - Model selection based on task complexity
   - Fallback to smaller models for simple tasks

2. **Advanced MCP Features**
   - Dynamic tool discovery
   - Custom protocol extensions
   - Federated MCP servers

3. **Analytics Integration**
   - Usage tracking and reporting
   - Performance metrics
   - Error rate monitoring

4. **Plugin System**
   - Allow third-party extensions
   - Custom tool development SDK
   - Marketplace for HALCON tools

This architecture provides a solid foundation for integrating Claude's capabilities into HALCON while maintaining flexibility for future enhancements and other system integrations.