const https = require('https');
require('dotenv').config();

/**
 * Simple function to query Claude API using only Node.js built-ins
 * @param {string} prompt - The prompt to send to Claude
 * @param {number} maxTokens - Maximum tokens in response (default: 1000)
 * @returns {Promise<string>} The response from Claude
 */
async function queryClaude(prompt, maxTokens = 1000) {
  const apiKey = process.env.CLAUDE_API_KEY;
  
  if (!apiKey) {
    throw new Error('CLAUDE_API_KEY not found in environment variables');
  }

  const data = JSON.stringify({
    model: 'claude-3-sonnet-20240229',
    max_tokens: maxTokens,
    messages: [
      {
        role: 'user',
        content: prompt
      }
    ]
  });

  const options = {
    hostname: 'api.anthropic.com',
    port: 443,
    path: '/v1/messages',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'Content-Length': data.length
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
            reject(new Error(response.error.message));
            return;
          }

          // Extract text from response
          const textContent = response.content
            .filter(block => block.type === 'text')
            .map(block => block.text)
            .join('\n');

          resolve(textContent);
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

// Test the function
async function testClaudeAPI() {
  console.log('Testing Claude API connection...');
  console.log('Using API key:', process.env.CLAUDE_API_KEY ? 'Found' : 'Not found');
  
  try {
    const response = await queryClaude('Say hello and confirm you are working! Keep it brief.');
    console.log('\nClaude response:');
    console.log(response);
    console.log('\n✅ API connection successful!');
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
  }
}

// Run test
testClaudeAPI();

// Export for use in other files
module.exports = { queryClaude };