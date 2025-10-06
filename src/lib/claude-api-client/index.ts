import * as https from 'https';
import { ClaudeAPIConfig, QueryOptions, ClaudeResponse } from './types';

export class ClaudeAPIClient {
  private apiKey: string;
  private config: ClaudeAPIConfig;
  private defaultOptions: QueryOptions = {
    model: 'claude-3-5-sonnet-20241022',
    maxTokens: 1000,
    temperature: 1.0
  };

  constructor(config?: Partial<ClaudeAPIConfig>) {
    this.apiKey = process.env.CLAUDE_API_KEY || '';
    
    if (!this.apiKey) {
      throw new Error('CLAUDE_API_KEY not found in environment variables');
    }

    this.config = {
      ...this.defaultOptions,
      ...config
    };
  }

  async query(prompt: string, options?: Partial<QueryOptions>): Promise<string> {
    const requestOptions = {
      ...this.config,
      ...options
    };

    try {
      const response = await this.makeRequest({
        model: requestOptions.model,
        max_tokens: requestOptions.maxTokens,
        temperature: requestOptions.temperature,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      });

      return this.extractTextFromResponse(response);
    } catch (error) {
      if (this.isTransientError(error) && !options?.noRetry) {
        // Retry once on transient failures
        return this.query(prompt, { ...options, noRetry: true });
      }
      throw error;
    }
  }

  async *streamQuery(prompt: string, options?: Partial<QueryOptions>): AsyncGenerator<string> {
    const stream = this.makeStreamingRequest({
      model: options?.model || this.config.model,
      max_tokens: options?.maxTokens || this.config.maxTokens,
      temperature: options?.temperature || this.config.temperature,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      stream: true
    });

    for await (const chunk of stream) {
      yield this.extractTextFromResponse(chunk);
    }
  }

  private async makeRequest(data: any): Promise<ClaudeResponse> {
    const jsonData = JSON.stringify(data);

    const options = {
      hostname: 'api.anthropic.com',
      port: 443,
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Length': jsonData.length
      }
    };

    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let responseData = '';

        res.on('data', (chunk) => {
          responseData += chunk;
        });

        res.on('end', () => {
          try {
            const response = JSON.parse(responseData);
            
            if (response.error) {
              reject(new Error(`API Error: ${response.error.message}`));
              return;
            }

            resolve(response);
          } catch (error) {
            reject(error);
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.write(jsonData);
      req.end();
    });
  }

  private async *makeStreamingRequest(data: any): AsyncGenerator<ClaudeResponse> {
    // Streaming implementation would go here
    // For now, just return a single response
    const response = await this.makeRequest(data);
    yield response;
  }

  private extractTextFromResponse(response: ClaudeResponse): string {
    return response.content
      .filter(block => block.type === 'text')
      .map(block => block.text)
      .join('\n');
  }

  private isTransientError(error: any): boolean {
    const transientErrors = ['ECONNRESET', 'ETIMEDOUT', 'ENOTFOUND'];
    return transientErrors.includes(error.code) || 
           error.message?.includes('Transient');
  }
}

// Export for CommonJS compatibility
export default ClaudeAPIClient;