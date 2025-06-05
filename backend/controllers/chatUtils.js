// Utility functions for chat routes
const Summary = require("../models/summary");
const crypto = require("crypto");

const invalidateCachedSummary = async (userId, chatSessionId) => {
  try {
    await Summary.deleteOne({ userId, chatSessionId });
    console.log(`Cached summary invalidated for session ${chatSessionId}`);
  } catch (error) {
    console.error("Error invalidating cached summary:", error);
  }
};

const simpleHash = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).substring(0, 8);
};

module.exports = {
  invalidateCachedSummary,
  simpleHash,
};
