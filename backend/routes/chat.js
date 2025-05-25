const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');
const Message = require('../models/message');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/chat
// @desc    Send message to AI and get response
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { content, chatSessionId } = req.body;
    const userId = req.user.id;

    if (!content || content.trim() === '') {
      return res.status(400).json({ message: 'Message content is required' });
    }

    // Generate a new chatSessionId if none provided
    const sessionId = chatSessionId || Date.now().toString();    // Save user message to DB
    const userMessage = new Message({
      userId,
      chatSessionId: sessionId,
      role: 'user',
      content,
      chatType: 'main'
    });await userMessage.save();    // Get the last 10 messages for this chat session for context
    const messageHistory = await Message.find({ 
      userId, 
      chatSessionId: sessionId,
      chatType: 'main'
    })
      .sort({ timestamp: -1 })
      .limit(10)
      .sort({ timestamp: 1 });

    // Format messages for Gemini API
    const formattedMessages = messageHistory.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    // Add the system prompt as the first message from the model if no history exists
    if (formattedMessages.length === 0 || formattedMessages[0].role !== 'model') {
      formattedMessages.unshift({
        role: 'model',
        parts: [{ text: 'You are a helpful assistant.' }]
      });
    }    // Call Gemini API
    const response = await axios.post(
      process.env.GEMINI_API_URL,
      {
        contents: formattedMessages,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800,
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          key: process.env.GEMINI_API_KEY
        }
      }
    );

    // Extract response from Gemini API
    const assistantResponse = response.data.candidates[0].content.parts[0].text;    // Save assistant response to DB
    const assistantMessage = new Message({
      userId,
      chatSessionId: sessionId,
      role: 'assistant',
      content: assistantResponse || 'Sorry, I could not generate a response. Please try again.',
      chatType: 'main'
    });

    await assistantMessage.save();

    res.json({
      message: assistantResponse,
      messageId: assistantMessage._id,
      chatSessionId: sessionId
    });
  } catch (error) {
    console.error('Chat error:', error.message);
    if (error.response) {
      console.error('Gemini API error:', error.response.data);
    }
    
    try {      // Create a fallback response in case of error
      const errorMessage = new Message({
        userId,
        chatSessionId: sessionId,
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        chatType: 'main'
      });
      
      await errorMessage.save();
      
      res.json({
        message: errorMessage.content,
        messageId: errorMessage._id,
        chatSessionId: sessionId
      });
    } catch (fallbackError) {
      console.error('Fallback error response failed:', fallbackError);
      res.status(500).json({ message: 'Error processing your request' });
    }
  }
});

// @route   GET /api/chat/history
// @desc    Get user's chat history (main messages only)
// @access  Private
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const messages = await Message.find({ 
      userId,
      chatType: 'main'
    }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    console.error('Get history error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/chat/sessions
// @desc    Get user's chat sessions
// @access  Private
router.get('/sessions', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
      // Get distinct chat sessions with first message content and timestamp for preview
    const sessions = await Message.aggregate([
      { $match: { 
          userId: new mongoose.Types.ObjectId(userId),
          chatType: 'main'
        }
      },
      { $sort: { timestamp: 1 } },
      { $group: {
          _id: "$chatSessionId",
          firstMessage: { $first: "$content" },
          lastMessageTime: { $last: "$timestamp" },
          messageCount: { $sum: 1 }
        }
      },
      { $sort: { lastMessageTime: -1 } }
    ]);
    
    res.json(sessions);
  } catch (error) {
    console.error('Get sessions error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/chat/session/:sessionId
// @desc    Get messages for a specific chat session (main messages only)
// @access  Private
router.get('/session/:sessionId', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { sessionId } = req.params;
    
    const messages = await Message.find({ 
      userId, 
      chatSessionId: sessionId,
      chatType: 'main' // Only get main messages, not side threads
    }).sort({ timestamp: 1 });
    
    res.json(messages);
  } catch (error) {
    console.error('Get session messages error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/chat/history
// @desc    Clear user's chat history
// @access  Private
router.delete('/history', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    await Message.deleteMany({ userId });
    res.json({ message: 'Chat history cleared successfully' });
  } catch (error) {
    console.error('Clear history error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/chat/session/:sessionId
// @desc    Delete a specific chat session
// @access  Private
router.delete('/session/:sessionId', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { sessionId } = req.params;
    
    await Message.deleteMany({ userId, chatSessionId: sessionId });
    
    res.json({ message: 'Chat session deleted successfully' });  } catch (error) {
    console.error('Delete session error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/chat/followup
// @desc    Process follow-up question based on selected text
// @access  Private
router.post('/followup', authMiddleware, async (req, res) => {
  try {
    const { selectedText, originalAssistantMessage, userFollowupQuestion, chatSessionId } = req.body;
    const userId = req.user.id;

    if (!selectedText || !originalAssistantMessage || !userFollowupQuestion) {
      return res.status(400).json({ message: 'Missing required information for follow-up' });
    }

    // Get the last 10 messages for this chat session for context
    const messageHistory = await Message.find({ userId, chatSessionId })
      .sort({ timestamp: -1 })
      .limit(10)
      .sort({ timestamp: 1 });

    // Format messages for Gemini API
    const formattedMessages = messageHistory.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    // Add the system prompt as the first message if not present
    if (formattedMessages.length === 0 || formattedMessages[0].role !== 'model') {
      formattedMessages.unshift({
        role: 'model',
        parts: [{ text: 'You are a helpful assistant.' }]
      });
    }

    // Add the original assistant message and the follow-up question with selected text
    formattedMessages.push({
      role: 'user',
      parts: [{ text: `Regarding this part of your previous response: "${selectedText}", ${userFollowupQuestion}` }]
    });

    // Call Gemini API
    const response = await axios.post(
      process.env.GEMINI_API_URL,
      {
        contents: formattedMessages,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800,
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          key: process.env.GEMINI_API_KEY
        }
      }
    );

    // Extract response from Gemini API
    const assistantResponse = response.data.candidates[0].content.parts[0].text;

    // Save the follow-up question to DB
    const userMessage = new Message({
      userId,
      chatSessionId,
      role: 'user',
      content: `Regarding: "${selectedText}" - ${userFollowupQuestion}`,
      selectedText,
      fullAssistantMessage: originalAssistantMessage,
    });
    await userMessage.save();

    // Save the assistant response to DB
    const assistantMessage = new Message({
      userId,
      chatSessionId,
      role: 'assistant',
      content: assistantResponse || 'Sorry, I could not generate a response. Please try again.',
      replyToMessageId: userMessage._id
    });
    await assistantMessage.save();

    res.json({
      message: assistantResponse,
      messageId: assistantMessage._id,
      chatSessionId
    });
  } catch (error) {
    console.error('Follow-up error:', error.message);
    if (error.response) {
      console.error('Gemini API error:', error.response.data);
    }
    res.status(500).json({ message: 'Server error processing follow-up question' });
  }
});

// @route   POST /api/chat/side-thread
// @desc    Create or continue a side thread conversation
// @access  Private
router.post('/side-thread', authMiddleware, async (req, res) => {
  try {
    const { mainThreadId, linkedToMessageId, selectedText, userQuery } = req.body;
    const userId = req.user.id;

    if (!mainThreadId || !linkedToMessageId || !selectedText || !userQuery) {
      return res.status(400).json({ message: 'Missing required information for side thread' });
    }

    // Get the linked message for context
    const linkedMessage = await Message.findById(linkedToMessageId);
    if (!linkedMessage) {
      return res.status(404).json({ message: 'Linked message not found' });
    }

    // Get main thread context (last 10 messages)
    const mainThreadMessages = await Message.find({ 
      userId, 
      chatSessionId: mainThreadId,
      chatType: 'main'
    })
    .sort({ timestamp: -1 })
    .limit(10)
    .sort({ timestamp: 1 });    // Get existing side thread messages for this specific selected text
    const sideThreadMessages = await Message.find({
      userId,
      mainThreadId,
      linkedToMessageId,
      chatType: 'side',
      selectedText: selectedText // Filter by the specific selected text
    }).sort({ timestamp: 1 });    // Simple hash function to match frontend
    const simpleHash = (str) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
      }
      return Math.abs(hash).toString(16).substring(0, 8);
    };

    // Generate unique side thread ID based on parent message and selected text hash
    // This allows multiple side threads per parent message for different text selections
    const selectedTextHash = simpleHash(selectedText);
    const sideThreadId = sideThreadMessages.length > 0 
      ? sideThreadMessages[0].chatSessionId 
      : `side_${linkedToMessageId}_${selectedTextHash}_${Date.now()}`;// Save user question with selected text for unique identification
    const userMessage = new Message({
      userId,
      chatSessionId: sideThreadId,
      role: 'user',
      content: userQuery,
      chatType: 'side',
      mainThreadId,
      linkedToMessageId,
      selectedText: selectedText // Always store selected text for identification
    });
    await userMessage.save();

    // Prepare context for AI
    const contextMessages = [
      // System prompt
      {
        role: 'model',
        parts: [{ text: 'You are a helpful assistant. The user is asking follow-up questions about a specific part of a previous conversation.' }]
      },
      // Main thread context (last few messages)
      ...mainThreadMessages.slice(-5).map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      })),
      // The linked message for context
      {
        role: 'model',
        parts: [{ text: linkedMessage.content }]
      },
      // Previous side thread messages
      ...sideThreadMessages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      })),
      // Current question with selected text context
      {
        role: 'user',
        parts: [{ text: `About this specific part: "${selectedText}"\n\n${userQuery}` }]
      }
    ];

    // Call Gemini API
    const response = await axios.post(
      process.env.GEMINI_API_URL,
      {
        contents: contextMessages,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800,
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          key: process.env.GEMINI_API_KEY
        }
      }
    );

    const assistantResponse = response.data.candidates[0].content.parts[0].text;    // Save assistant response with selected text for identification
    const assistantMessage = new Message({
      userId,
      chatSessionId: sideThreadId,
      role: 'assistant',
      content: assistantResponse || 'Sorry, I could not generate a response. Please try again.',
      chatType: 'side',
      mainThreadId,
      linkedToMessageId,
      selectedText: selectedText, // Store selected text for identification
      parentMessageId: userMessage._id
    });
    await assistantMessage.save();

    res.json({
      message: assistantResponse,
      messageId: assistantMessage._id,
      sideThreadId,
      userMessageId: userMessage._id
    });
  } catch (error) {
    console.error('Side thread error:', error.message);
    if (error.response) {
      console.error('Gemini API error:', error.response.data);
    }
    res.status(500).json({ message: 'Server error processing side thread' });
  }
});

// @route   GET /api/chat/side-thread/:mainThreadId/:linkedToMessageId/:selectedTextHash?
// @desc    Get side thread messages for a specific linked message and optionally specific selected text
// @access  Private
router.get('/side-thread/:mainThreadId/:linkedToMessageId/:selectedTextHash?', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { mainThreadId, linkedToMessageId, selectedTextHash } = req.params;
    
    let query = {
      userId,
      mainThreadId,
      linkedToMessageId,
      chatType: 'side'
    };    // If selectedTextHash is provided, filter by it
    if (selectedTextHash && selectedTextHash !== 'undefined') {
      // Simple hash function to match frontend
      const simpleHash = (str) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
          const char = str.charCodeAt(i);
          hash = ((hash << 5) - hash) + char;
          hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash).toString(16).substring(0, 8);
      };

      // Find messages where the selectedText hash matches
      const allSideMessages = await Message.find(query);
      const filteredMessages = allSideMessages.filter(msg => {
        if (!msg.selectedText) return false;
        const hash = simpleHash(msg.selectedText);
        return hash === selectedTextHash;
      });
      
      return res.json(filteredMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)));
    }
    
    // If no hash provided, return all side threads for this message
    const sideMessages = await Message.find(query).sort({ timestamp: 1 });
    
    res.json(sideMessages);
  } catch (error) {
    console.error('Get side thread error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/chat/side-thread-selections/:mainThreadId/:linkedToMessageId
// @desc    Get all unique text selections that have side threads for a specific message
// @access  Private
router.get('/side-thread-selections/:mainThreadId/:linkedToMessageId', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { mainThreadId, linkedToMessageId } = req.params;
    
    // Get all unique selected texts for this message
    const sideMessages = await Message.find({
      userId,
      mainThreadId,
      linkedToMessageId,
      chatType: 'side',
      selectedText: { $ne: null, $ne: '' }
    }).select('selectedText chatSessionId timestamp').sort({ timestamp: 1 });    // Group by selected text to get unique selections with their thread info
    const uniqueSelections = {};
    
    // Simple hash function to match frontend
    const simpleHash = (str) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
      }
      return Math.abs(hash).toString(16).substring(0, 8);
    };

    sideMessages.forEach(msg => {
      if (!uniqueSelections[msg.selectedText]) {
        const hash = simpleHash(msg.selectedText);
        uniqueSelections[msg.selectedText] = {
          selectedText: msg.selectedText,
          selectedTextHash: hash,
          sideThreadId: msg.chatSessionId,
          firstMessageTime: msg.timestamp
        };
      }
    });
    
    res.json(Object.values(uniqueSelections));
  } catch (error) {
    console.error('Get side thread selections error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/chat/side-threads/:mainThreadId
// @desc    Get all side threads for a main thread (returns message IDs that have side threads)
// @access  Private
router.get('/side-threads/:mainThreadId', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { mainThreadId } = req.params;
    
    // Get distinct linkedToMessageId values
    const sideThreads = await Message.distinct('linkedToMessageId', {
      userId,
      mainThreadId,
      chatType: 'side',
      linkedToMessageId: { $ne: null }
    });
    
    res.json(sideThreads);
  } catch (error) {
    console.error('Get side threads error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/chat/summary/:sessionId
// @desc    Get summarized chat session including main and side threads
// @access  Private
router.get('/summary/:sessionId', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { sessionId } = req.params;

    // STEP 1: Fetch All Messages
    
    // Fetch main messages
    const mainMessages = await Message.find({
      userId,
      chatSessionId: sessionId,
      chatType: 'main'
    }).sort({ timestamp: 1 });

    // Fetch side messages
    const sideMessages = await Message.find({
      userId,
      mainThreadId: sessionId,
      chatType: 'side'
    }).sort({ timestamp: 1 });

    // STEP 2: Group Side Messages by linkedToMessageId
    const sideThreadsMap = new Map();

    for (const sideMessage of sideMessages) {
      const key = sideMessage.linkedToMessageId.toString();
      if (!sideThreadsMap.has(key)) {
        sideThreadsMap.set(key, []);
      }
      sideThreadsMap.get(key).push(sideMessage);
    }

    // STEP 3: Initialize Final Sequence
    const finalFormattedMessages = [];

    // STEP 4: Combine Main + Side in Chronological Order with Labels
    for (const mainMessage of mainMessages) {
      // Add Main User Message
      if (mainMessage.role === 'user') {
        finalFormattedMessages.push(`User: ${mainMessage.content}`);
      }

      // Add Main Assistant Message
      if (mainMessage.role === 'assistant') {
        finalFormattedMessages.push(`Assistant: ${mainMessage.content}`);
      }

      // Add Side Threads if present
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

    // STEP 5: Join into One String (for Summarization Model)
    const inputToSummarizer = finalFormattedMessages.join('\n\n');

    // STEP 6: Send to Summarizer AI (Gemini API)
    try {
      const summaryResponse = await axios.post(
        process.env.GEMINI_API_URL,
        {
          contents: [
            {
              role: 'user',
              parts: [{ 
                text: `Please provide a comprehensive summary of the following conversation. Include key topics discussed, main questions asked, answers provided, and any follow-up discussions. Organize the summary in a clear, structured format:\n\n${inputToSummarizer}` 
              }]
            }
          ],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 1000,
          }
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          params: {
            key: process.env.GEMINI_API_KEY
          }
        }
      );

      const summary = summaryResponse.data.candidates[0].content.parts[0].text;

      // Return the summary along with metadata
      res.json({
        sessionId,
        summary,
        totalMainMessages: mainMessages.length,
        totalSideMessages: sideMessages.length,
        mainThreadsWithSideThreads: sideThreadsMap.size,
        generatedAt: new Date().toISOString(),
        rawConversation: inputToSummarizer // Optional: include raw formatted conversation
      });
    } catch (summaryError) {
      console.error('Summary generation error:', summaryError);
      
      // Fallback: return formatted conversation without AI summary
      res.json({
        sessionId,
        summary: "Summary generation temporarily unavailable. Here's the formatted conversation:",
        totalMainMessages: mainMessages.length,
        totalSideMessages: sideMessages.length,
        mainThreadsWithSideThreads: sideThreadsMap.size,
        generatedAt: new Date().toISOString(),
        rawConversation: inputToSummarizer,
        error: "AI summarization failed, showing raw conversation"
      });
    }

  } catch (error) {
    console.error('Chat summary error:', error.message);
    res.status(500).json({ message: 'Server error generating chat summary' });
  }
});

module.exports = router;