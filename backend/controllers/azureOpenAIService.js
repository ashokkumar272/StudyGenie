// Handles all Azure OpenAI API calls
const { OpenAI } = require("openai");
require('dotenv').config();

// Initialize Azure OpenAI client
const openai = new OpenAI({
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  baseURL: `${process.env.AZURE_OPENAI_ENDPOINT}openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT}`,
  defaultQuery: { 'api-version': process.env.AZURE_OPENAI_API_VERSION },
  defaultHeaders: {
    'api-key': process.env.AZURE_OPENAI_API_KEY,
  },
});

const callAzureOpenAI = async (messages, options = {}) => {
  try {
    const { 
      temperature = 0.7, 
      maxTokens = 800, 
      topP = 1.0,
      frequencyPenalty = 0,
      presencePenalty = 0 
    } = options;

    // Convert Gemini format to OpenAI format
    const openAIMessages = messages.map(msg => {
      if (msg.role === 'model') {
        return {
          role: 'assistant',
          content: msg.parts[0].text
        };
      }
      return {
        role: msg.role,
        content: msg.parts[0].text
      };
    });

    const completion = await openai.chat.completions.create({
      model: process.env.AZURE_OPENAI_MODEL, // This will be the deployment name
      messages: openAIMessages,
      temperature,
      max_tokens: maxTokens,
      top_p: topP,
      frequency_penalty: frequencyPenalty,
      presence_penalty: presencePenalty,
    });

    // Return in a format similar to Gemini response
    return {
      candidates: [{
        content: {
          parts: [{
            text: completion.choices[0].message.content
          }]
        }
      }]
    };
  } catch (error) {
    console.error('Azure OpenAI API Error:', error);
    throw new Error(`Azure OpenAI API Error: ${error.message}`);
  }
};

module.exports = {
  callAzureOpenAI,
};
