// Example of using the Claude API client
// This can be run directly with Node.js

const path = require('path');
const fs = require('fs');

// Load environment variables
function loadEnv() {
  try {
    const envPath = path.join(__dirname, '..', '.env');
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

// Load the simple API client
const { queryClaude } = require('../test-claude-api-simple.js');

async function demonstrateClaudeAPI() {
  console.log('🌟 HALCON Claude API Integration Demo\n');
  
  try {
    // Example 1: Basic query
    console.log('1️⃣ Basic Query Example:');
    console.log('Prompt: "What is the HALCON project about?"');
    const response1 = await queryClaude(
      'Based on the name HALCON, what kind of cosmic productivity platform might this be? Keep your response to 2-3 sentences.'
    );
    console.log('Response:', response1);
    console.log('\n---\n');

    // Example 2: Astrological context
    console.log('2️⃣ Astrological Context Example:');
    console.log('Prompt: "Current cosmic productivity advice"');
    const response2 = await queryClaude(
      'Give me a brief cosmic productivity tip for today, incorporating planetary wisdom. Keep it under 50 words.'
    );
    console.log('Response:', response2);
    console.log('\n---\n');

    // Example 3: Technical assistance
    console.log('3️⃣ Technical Assistance Example:');
    console.log('Prompt: "React component structure advice"');
    const response3 = await queryClaude(
      'Suggest a simple React component structure for an orbital navigation system with 5 planets. Just list the component names, no code.'
    );
    console.log('Response:', response3);
    console.log('\n---\n');

    console.log('✅ All examples completed successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Advanced example with custom parameters
async function advancedExample() {
  console.log('\n📚 Advanced Example with Custom Parameters:\n');
  
  try {
    const complexPrompt = `You are a cosmic productivity assistant for HALCON.
    
    Context: HALCON uses planetary orbits as a navigation metaphor for organizing work tools.
    - Mercury: Communication
    - Venus: Creativity  
    - Mars: Execution
    - Jupiter: Knowledge
    - Saturn: Structure
    
    Task: Suggest which planet domain would be best for "reviewing code and fixing bugs" and explain why in 2 sentences.`;
    
    const response = await queryClaude(complexPrompt, 200); // Limit tokens
    console.log('Response:', response);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the demonstrations
async function main() {
  loadEnv(); // Make sure environment is loaded
  
  await demonstrateClaudeAPI();
  await advancedExample();
}

main();