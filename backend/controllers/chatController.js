// Handles all chat route logic
const Message = require("../models/message");
const Summary = require("../models/summary");
const mongoose = require("mongoose");
const chatUtils = require("./chatUtils");
require('dotenv').config();
const geminiService = require("./geminiService");

// POST /api/chat
async function sendMessage(req, res) {
  try {
    const { content, chatSessionId } = req.body;
    const userId = req.user.id;
    if (!content || content.trim() === "") {
      return res.status(400).json({ message: "Message content is required" });
    }
    const sessionId = chatSessionId || Date.now().toString();
    const userMessage = new Message({
      userId,
      chatSessionId: sessionId,
      role: "user",
      content,
      chatType: "main",
    });
    await userMessage.save();
    await chatUtils.invalidateCachedSummary(userId, sessionId);
    const messageHistory = await Message.find({
      userId,
      chatSessionId: sessionId,
      chatType: "main",
    })
      .sort({ timestamp: -1 })
      .limit(10)
      .sort({ timestamp: 1 });
    const formattedMessages = messageHistory.map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));
    if (
      formattedMessages.length === 0 ||
      formattedMessages[0].role !== "model"
    ) {
      formattedMessages.unshift({
        role: "model",
        parts: [{ text: "You are a helpful assistant." }],
      });
    }
    const response = await geminiService.callGeminiAPI(formattedMessages);
    const assistantResponse = response.candidates[0].content.parts[0].text;
    const assistantMessage = new Message({
      userId,
      chatSessionId: sessionId,
      role: "assistant",
      content:
        assistantResponse ||
        "Sorry, I could not generate a response. Please try again.",
      chatType: "main",
    });
    await assistantMessage.save();
    await chatUtils.invalidateCachedSummary(userId, sessionId);
    res.json({
      message: assistantResponse,
      messageId: assistantMessage._id,
      chatSessionId: sessionId,
    });
  } catch (error) {
    console.error("Chat error:", error.message);
    if (error.response) console.error("Gemini API error:", error.response.data);
    try {
      const errorMessage = new Message({
        userId: req.user.id,
        chatSessionId: req.body.chatSessionId || Date.now().toString(),
        role: "assistant",
        content:
          "Sorry, I encountered an error processing your request. Please try again.",
        chatType: "main",
      });
      await errorMessage.save();
      res.json({
        message: errorMessage.content,
        messageId: errorMessage._id,
        chatSessionId: errorMessage.chatSessionId,
      });
    } catch (fallbackError) {
      console.error("Fallback error response failed:", fallbackError);
      res.status(500).json({ message: "Error processing your request" });
    }
  }
}

// GET /api/chat/history
async function getHistory(req, res) {
  try {
    const userId = req.user.id;
    const messages = await Message.find({ userId, chatType: "main" }).sort({
      timestamp: 1,
    });
    res.json(messages);
  } catch (error) {
    console.error("Get history error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
}

// GET /api/chat/sessions
async function getSessions(req, res) {
  try {
    const userId = req.user.id;
    const sessions = await Message.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          chatType: "main",
        },
      },
      { $sort: { timestamp: 1 } },
      {
        $group: {
          _id: "$chatSessionId",
          firstMessage: { $first: "$content" },
          lastMessageTime: { $last: "$timestamp" },
          messageCount: { $sum: 1 },
        },
      },
      { $sort: { lastMessageTime: -1 } },
    ]);
    res.json(sessions);
  } catch (error) {
    console.error("Get sessions error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
}

// GET /api/chat/session/:sessionId
async function getSessionMessages(req, res) {
  try {
    const userId = req.user.id;
    const { sessionId } = req.params;
    const messages = await Message.find({
      userId,
      chatSessionId: sessionId,
      chatType: "main",
    }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    console.error("Get session messages error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
}

// DELETE /api/chat/history
async function clearHistory(req, res) {
  try {
    const userId = req.user.id;
    await Message.deleteMany({ userId });
    res.json({ message: "Chat history cleared successfully" });
  } catch (error) {
    console.error("Clear history error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
}

// DELETE /api/chat/session/:sessionId
async function deleteSession(req, res) {
  try {
    const userId = req.user.id;
    const { sessionId } = req.params;
    await Message.deleteMany({ userId, chatSessionId: sessionId });
    res.json({ message: "Chat session deleted successfully" });
  } catch (error) {
    console.error("Delete session error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
}

// POST /api/chat/followup
async function followup(req, res) {
  try {
    const {
      selectedText,
      originalAssistantMessage,
      userFollowupQuestion,
      chatSessionId,
    } = req.body;
    const userId = req.user.id;
    if (!selectedText || !originalAssistantMessage || !userFollowupQuestion) {
      return res
        .status(400)
        .json({ message: "Missing required information for follow-up" });
    }
    const messageHistory = await Message.find({ userId, chatSessionId })
      .sort({ timestamp: -1 })
      .limit(10)
      .sort({ timestamp: 1 });
    const formattedMessages = messageHistory.map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));
    if (
      formattedMessages.length === 0 ||
      formattedMessages[0].role !== "model"
    ) {
      formattedMessages.unshift({
        role: "model",
        parts: [{ text: "You are a helpful assistant." }],
      });
    }
    formattedMessages.push({
      role: "user",
      parts: [
        {
          text: `Regarding this part of your previous response: "${selectedText}", ${userFollowupQuestion}`,
        },
      ],
    });
    const response = await geminiService.callGeminiAPI(formattedMessages);
    const assistantResponse = response.candidates[0].content.parts[0].text;
    const userMessage = new Message({
      userId,
      chatSessionId,
      role: "user",
      content: `Regarding: "${selectedText}" - ${userFollowupQuestion}`,
      selectedText,
      fullAssistantMessage: originalAssistantMessage,
    });
    await userMessage.save();
    await chatUtils.invalidateCachedSummary(userId, chatSessionId);
    const assistantMessage = new Message({
      userId,
      chatSessionId,
      role: "assistant",
      content:
        assistantResponse ||
        "Sorry, I could not generate a response. Please try again.",
      replyToMessageId: userMessage._id,
    });
    await assistantMessage.save();
    await chatUtils.invalidateCachedSummary(userId, chatSessionId);
    res.json({
      message: assistantResponse,
      messageId: assistantMessage._id,
      chatSessionId,
    });
  } catch (error) {
    console.error("Follow-up error:", error.message);
    if (error.response) console.error("Gemini API error:", error.response.data);
    res
      .status(500)
      .json({ message: "Server error processing follow-up question" });
  }
}

// POST /api/chat/side-thread
async function sideThread(req, res) {
  try {
    const { mainThreadId, linkedToMessageId, selectedText, userQuery } =
      req.body;
    const userId = req.user.id;
    if (!mainThreadId || !linkedToMessageId || !selectedText || !userQuery) {
      return res
        .status(400)
        .json({ message: "Missing required information for side thread" });
    }
    const linkedMessage = await Message.findById(linkedToMessageId);
    if (!linkedMessage) {
      return res.status(404).json({ message: "Linked message not found" });
    }
    const mainThreadMessages = await Message.find({
      userId,
      chatSessionId: mainThreadId,
      chatType: "main",
    })
      .sort({ timestamp: -1 })
      .limit(10)
      .sort({ timestamp: 1 });
    const sideThreadMessages = await Message.find({
      userId,
      mainThreadId,
      linkedToMessageId,
      chatType: "side",
      selectedText: selectedText,
    }).sort({ timestamp: 1 });
    const selectedTextHash = chatUtils.simpleHash(selectedText);
    const sideThreadId =
      sideThreadMessages.length > 0
        ? sideThreadMessages[0].chatSessionId
        : `side_${linkedToMessageId}_${selectedTextHash}_${Date.now()}`;
    const userMessage = new Message({
      userId,
      chatSessionId: sideThreadId,
      role: "user",
      content: userQuery,
      chatType: "side",
      mainThreadId,
      linkedToMessageId,
      selectedText,
    });
    await userMessage.save();
    await chatUtils.invalidateCachedSummary(userId, mainThreadId);
    const contextMessages = [
      {
        role: "model",
        parts: [
          {
            text: "You are a helpful assistant. The user is asking follow-up questions about a specific part of a previous conversation.",
          },
        ],
      },
      ...mainThreadMessages
        .slice(-5)
        .map((msg) => ({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.content }],
        })),
      { role: "model", parts: [{ text: linkedMessage.content }] },
      ...sideThreadMessages.map((msg) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      })),
      {
        role: "user",
        parts: [
          {
            text: `About this specific part: "${selectedText}"

${userQuery}`,
          },
        ],
      },
    ];
    const response = await geminiService.callGeminiAPI(contextMessages);
    const assistantResponse = response.candidates[0].content.parts[0].text;
    const assistantMessage = new Message({
      userId,
      chatSessionId: sideThreadId,
      role: "assistant",
      content:
        assistantResponse ||
        "Sorry, I could not generate a response. Please try again.",
      chatType: "side",
      mainThreadId,
      linkedToMessageId,
      selectedText,
      parentMessageId: userMessage._id,
    });
    await assistantMessage.save();
    await chatUtils.invalidateCachedSummary(userId, mainThreadId);
    res.json({
      message: assistantResponse,
      messageId: assistantMessage._id,
      sideThreadId,
      userMessageId: userMessage._id,
    });
  } catch (error) {
    console.error("Side thread error:", error.message);
    if (error.response) console.error("Gemini API error:", error.response.data);
    res.status(500).json({ message: "Server error processing side thread" });
  }
}

// GET /api/chat/side-thread/:mainThreadId/:linkedToMessageId/:selectedTextHash?
async function getSideThread(req, res) {
  try {
    const userId = req.user.id;
    const { mainThreadId, linkedToMessageId, selectedTextHash } = req.params;
    let query = { userId, mainThreadId, linkedToMessageId, chatType: "side" };
    if (selectedTextHash && selectedTextHash !== "undefined") {
      const allSideMessages = await Message.find(query);
      const filteredMessages = allSideMessages.filter((msg) => {
        if (!msg.selectedText) return false;
        const hash = chatUtils.simpleHash(msg.selectedText);
        return hash === selectedTextHash;
      });
      return res.json(
        filteredMessages.sort(
          (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
        )
      );
    }
    const sideMessages = await Message.find(query).sort({ timestamp: 1 });
    res.json(sideMessages);
  } catch (error) {
    console.error("Get side thread error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
}

// GET /api/chat/side-thread-selections/:mainThreadId/:linkedToMessageId
async function getSideThreadSelections(req, res) {
  try {
    const userId = req.user.id;
    const { mainThreadId, linkedToMessageId } = req.params;
    const sideMessages = await Message.find({
      userId,
      mainThreadId,
      linkedToMessageId,
      chatType: "side",
      selectedText: { $ne: null, $ne: "" },
    })
      .select("selectedText chatSessionId timestamp")
      .sort({ timestamp: 1 });
    const uniqueSelections = {};
    sideMessages.forEach((msg) => {
      if (!uniqueSelections[msg.selectedText]) {
        const hash = chatUtils.simpleHash(msg.selectedText);
        uniqueSelections[msg.selectedText] = {
          selectedText: msg.selectedText,
          selectedTextHash: hash,
          sideThreadId: msg.chatSessionId,
          firstMessageTime: msg.timestamp,
        };
      }
    });
    res.json(Object.values(uniqueSelections));
  } catch (error) {
    console.error("Get side thread selections error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
}

// GET /api/chat/side-threads/:mainThreadId
async function getAllSideThreads(req, res) {
  try {
    const userId = req.user.id;
    const { mainThreadId } = req.params;
    const sideThreads = await Message.distinct("linkedToMessageId", {
      userId,
      mainThreadId,
      chatType: "side",
      linkedToMessageId: { $ne: null },
    });
    res.json(sideThreads);
  } catch (error) {
    console.error("Get side threads error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
}

// GET /api/chat/summary/:sessionId
async function getSummary(req, res) {
  try {
    const userId = req.user.id;
    const { sessionId } = req.params;
    const mainMessages = await Message.find({
      userId,
      chatSessionId: sessionId,
      chatType: "main",
    }).sort({ timestamp: 1 });
    const sideMessages = await Message.find({
      userId,
      mainThreadId: sessionId,
      chatType: "side",
    }).sort({ timestamp: 1 });
    if (mainMessages.length === 0 && sideMessages.length === 0) {
      return res
        .status(404)
        .json({ message: "No messages found for this session" });
    }
    const allMessages = [...mainMessages, ...sideMessages];
    const latestMessageTimestamp = allMessages.reduce(
      (latest, msg) =>
        new Date(msg.timestamp) > new Date(latest) ? msg.timestamp : latest,
      allMessages[0].timestamp
    );
    const contentForHash = allMessages
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
      .map((msg) => `${msg.role}:${msg.content}:${msg.chatType}`)
      .join("|");
    const contentHash = require("crypto")
      .createHash("sha256")
      .update(contentForHash)
      .digest("hex");
    const existingSummary = await Summary.findOne({
      userId,
      chatSessionId: sessionId,
    });
    if (
      existingSummary &&
      existingSummary.contentHash === contentHash &&
      new Date(existingSummary.lastMessageTimestamp) >=
        new Date(latestMessageTimestamp)
    ) {
      return res.json({
        sessionId,
        summary: existingSummary.summary,
        totalMainMessages: existingSummary.totalMainMessages,
        totalSideMessages: existingSummary.totalSideMessages,
        mainThreadsWithSideThreads: existingSummary.mainThreadsWithSideThreads,
        generatedAt: existingSummary.generatedAt.toISOString(),
        rawConversation: existingSummary.rawConversation,
        cached: true,
      });
    }
    const sideThreadsMap = new Map();
    for (const sideMessage of sideMessages) {
      const key = sideMessage.linkedToMessageId.toString();
      if (!sideThreadsMap.has(key)) sideThreadsMap.set(key, []);
      sideThreadsMap.get(key).push(sideMessage);
    }
    const finalFormattedMessages = [];
    for (const mainMessage of mainMessages) {
      if (mainMessage.role === "user")
        finalFormattedMessages.push(`User: ${mainMessage.content}`);
      if (mainMessage.role === "assistant")
        finalFormattedMessages.push(`Assistant: ${mainMessage.content}`);
      const linkedId = mainMessage._id.toString();
      if (sideThreadsMap.has(linkedId)) {
        const sideThreadMessages = sideThreadsMap.get(linkedId);
        for (const sideMessage of sideThreadMessages) {
          const label = `↳ [Side Thread - ${sideMessage.role}]`;
          const formatted = `${label}: ${sideMessage.content}`;
          finalFormattedMessages.push(formatted);
        }
      }
    }
    const inputToSummarizer = finalFormattedMessages.join("\n\n");
    let summary;
    let error = null;
    try {
      const summaryResponse = await geminiService.callGeminiAPI(
        [
          {
            role: "user",
            parts: [
              {
                text: `Summarize this chat between a user and an AI assistant. The conversation includes main messages and side threads (follow-up questions indicated by "↳ [Side Thread]" prefix).

                  Your task:
                  1. Organize by topic with clear headings (e.g., "1. Topic Name")
                  2. For each topic, include:
                     - Brief summary of key points
                     - A "🔍 User Doubts & Clarifications" section for related side threads
                  3. Format like this:
                  ---
                  ### 1. [Topic Name]
                  - Main points discussed
                  🔍 *User Doubts & Clarifications*:
                  - Question: [user query]  
                    Clarification: [answer]
                  ---

                  Keep it concise but complete. Focus on what matters, not raw chat logs.

                  Here's the conversation:
                  ${inputToSummarizer}`,
              },
            ],
          },
        ],
        { temperature: 0.3, maxOutputTokens: 1000 }
      );
      summary = summaryResponse.candidates[0].content.parts[0].text;
    } catch (summaryError) {
      console.error("Summary generation error:", summaryError);
      summary =
        "Summary generation temporarily unavailable. Here's the formatted conversation:";
      error = "AI summarization failed, showing raw conversation";
    }
    const summaryData = {
      userId,
      chatSessionId: sessionId,
      summary,
      totalMainMessages: mainMessages.length,
      totalSideMessages: sideMessages.length,
      mainThreadsWithSideThreads: sideThreadsMap.size,
      rawConversation: inputToSummarizer,
      generatedAt: new Date(),
      lastMessageTimestamp: latestMessageTimestamp,
      contentHash,
    };
    try {
      await Summary.findOneAndUpdate(
        { userId, chatSessionId: sessionId },
        summaryData,
        { upsert: true, new: true }
      );
    } catch (saveError) {
      console.error("Error saving summary to database:", saveError);
    }
    const responseData = {
      sessionId,
      summary,
      totalMainMessages: mainMessages.length,
      totalSideMessages: sideMessages.length,
      mainThreadsWithSideThreads: sideThreadsMap.size,
      generatedAt: new Date().toISOString(),
      rawConversation: inputToSummarizer,
      cached: false,
    };
    if (error) responseData.error = error;
    res.json(responseData);
  } catch (error) {
    console.error("Chat summary error:", error.message);
    res.status(500).json({ message: "Server error generating chat summary" });
  }
}

// DELETE /api/chat/summary/:sessionId
async function invalidateSummary(req, res) {
  try {
    const userId = req.user.id;
    const { sessionId } = req.params;
    await chatUtils.invalidateCachedSummary(userId, sessionId);
    res.json({ message: "Cached summary invalidated successfully" });
  } catch (error) {
    console.error("Summary invalidation error:", error.message);
    res.status(500).json({ message: "Server error invalidating summary" });
  }
}

module.exports = {
  sendMessage,
  getHistory,
  getSessions,
  getSessionMessages,
  clearHistory,
  deleteSession,
  followup,
  sideThread,
  getSideThread,
  getSideThreadSelections,
  getAllSideThreads,
  getSummary,
  invalidateSummary,
};
