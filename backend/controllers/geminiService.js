// Handles all Gemini API calls
const axios = require("axios");

const callGeminiAPI = async (contents, generationConfig = { temperature: 0.7, maxOutputTokens: 800 }) => {
  const response = await axios.post(
    process.env.GEMINI_API_URL,
    {
      contents,
      generationConfig,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        key: process.env.GEMINI_API_KEY,
      },
    }
  );
  return response.data;
};

module.exports = {
  callGeminiAPI,
};
