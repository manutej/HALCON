export interface ClaudeAPIConfig {
  model: string;
  maxTokens: number;
  temperature: number;
}

export interface QueryOptions extends ClaudeAPIConfig {
  noRetry?: boolean;
}

export interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ClaudeContentBlock {
  type: 'text';
  text: string;
}

export interface ClaudeResponse {
  content: ClaudeContentBlock[];
  id?: string;
  model?: string;
  stop_reason?: string;
  stop_sequence?: string | null;
  usage?: {
    input_tokens: number;
    output_tokens: number;
  };
}

export interface ClaudeError {
  error: {
    type: string;
    message: string;
  };
}