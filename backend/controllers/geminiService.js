// Handles all Gemini API calls using the official Gemini SDK
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const callGeminiAPI = async (contents, generationConfig = { temperature: 0.7, maxOutputTokens: 800 }) => {
  // The SDK expects 'contents' as an array of message objects
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents,
    generationConfig,
  });
  return response;
};

module.exports = {
  callGeminiAPI,
};