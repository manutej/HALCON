const https = require('https');
const fs = require('fs');
const path = require('path');

// Simple .env parser
function loadEnv() {
  try {
    const envPath = path.join(__dirname, '.env');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    
    lines.forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const [key, ...valueParts] = trimmedLine.split('=');
        const value = valueParts.join('=').replace(/^["']|["']$/g, '');
        process.env[key] = value;
      }
    });
  } catch (error) {
    console.error('Error loading .env file:', error.message);
  }
}

// Load environment variables
loadEnv();

/**
 * Simple function to query Claude API
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
    model: 'claude-3-5-sonnet-20241022',
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
  console.log('🚀 Testing Claude API connection...');
  console.log('📋 API key status:', process.env.CLAUDE_API_KEY ? '✅ Found' : '❌ Not found');
  
  try {
    console.log('\n📤 Sending test prompt to Claude...');
    const response = await queryClaude('Say hello and confirm you are working! Respond in exactly one sentence.');
    console.log('\n📥 Claude response:');
    console.log('---');
    console.log(response);
    console.log('---');
    console.log('\n✅ API connection successful!');
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    if (error.message.includes('401')) {
      console.error('💡 This might be an authentication issue. Check your API key.');
    }
  }
}

// Run test
console.log('=== Claude API Test ===\n');
testClaudeAPI();

// Export for use in other files
module.exports = { queryClaude };