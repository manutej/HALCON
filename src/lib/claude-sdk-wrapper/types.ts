/**
 * Claude SDK Wrapper Types
 * Comprehensive type definitions for the HALCON Claude SDK integration
 */

// Configuration Types
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
  maxTokens?: number;
  sessionId?: string;
  abortController?: AbortController;
  mcpServers?: string[];
}

// Response Types
export interface Message {
  role: 'user' | 'assistant';
  content: string;
  metadata?: MessageMetadata;
}

export interface MessageMetadata {
  model?: string;
  turn?: number;
  timestamp?: Date;
  source?: 'claude' | 'mcp' | 'tool';
  toolCalls?: ToolCall[];
}

export interface ToolCall {
  id: string;
  name: string;
  input: Record<string, unknown>;
  output?: unknown;
}

export interface QueryResult {
  messages: Message[];
  metadata: QueryMetadata;
  error?: ClaudeSDKError;
}

export interface QueryMetadata {
  model: string;
  turns: number;
  duration: number;
  tokensUsed?: {
    input: number;
    output: number;
    total: number;
  };
}

// Session Types
export interface Session {
  id: string;
  messages: Message[];
  createdAt: Date;
  lastActive: Date;
  metadata?: Record<string, unknown>;
}

// MCP Types
export interface MCPServer {
  id: string;
  url: string;
  capabilities: string[];
  status: 'connected' | 'disconnected' | 'error';
}

export interface MCPServerConfig {
  id: string;
  url: string;
  capabilities: string[];
  apiKey?: string;
  timeout?: number;
}

export interface MCPResponse {
  serverId: string;
  data: unknown;
  metadata?: Record<string, unknown>;
}

// Tool Types
export interface CustomTool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  handler: (input: Record<string, unknown>) => Promise<unknown>;
}

// Error Types
export class ClaudeSDKError extends Error {
  code: string;
  isRetryable: boolean;
  metadata?: Record<string, unknown>;

  constructor(
    message: string,
    code: string,
    isRetryable = false,
    metadata?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ClaudeSDKError';
    this.code = code;
    this.isRetryable = isRetryable;
    this.metadata = metadata;
  }
}

// Configuration Validation
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

// Retry Configuration
export interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
}
