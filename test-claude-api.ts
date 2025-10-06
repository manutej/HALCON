import * as dotenv from 'dotenv';
import { Anthropic } from '@anthropic-ai/sdk';

// Load environment variables
dotenv.config();

/**
 * Simple function to query Claude API
 * @param prompt - The prompt to send to Claude
 * @param maxTokens - Maximum tokens in response (default: 1000)
 * @returns The response from Claude
 */
export async function queryClaude(prompt: string, maxTokens: number = 1000): Promise<string> {
  // Get API key from environment
  const apiKey = process.env.CLAUDE_API_KEY;
  
  if (!apiKey) {
    throw new Error('CLAUDE_API_KEY not found in environment variables');
  }

  // Initialize Anthropic client
  const anthropic = new Anthropic({
    apiKey: apiKey,
  });

  try {
    // Make API call to Claude
    const response = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: maxTokens,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    // Extract text from response
    const textContent = response.content
      .filter(block => block.type === 'text')
      .map(block => block.text)
      .join('\n');

    return textContent;
  } catch (error) {
    console.error('Error querying Claude API:', error);
    throw error;
  }
}

// Example usage (uncomment to test)
async function testClaudeAPI() {
  try {
    console.log('Testing Claude API connection...');
    const response = await queryClaude('Say hello and confirm you are working!');
    console.log('Claude response:', response);
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run test if this file is executed directly
if (require.main === module) {
  testClaudeAPI();
}