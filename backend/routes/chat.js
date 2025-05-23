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
    const sessionId = chatSessionId || Date.now().toString();

    // Save user message to DB
    const userMessage = new Message({
      userId,
      chatSessionId: sessionId,
      role: 'user',
      content
    });    await userMessage.save();

    // Get the last 10 messages for this chat session for context
    const messageHistory = await Message.find({ userId, chatSessionId: sessionId })
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
      content: assistantResponse || 'Sorry, I could not generate a response. Please try again.'
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
    
    try {
      // Create a fallback response in case of error
      const errorMessage = new Message({
        userId,
        chatSessionId: sessionId,
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again.'
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
// @desc    Get user's chat history
// @access  Private
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const messages = await Message.find({ userId }).sort({ timestamp: 1 });
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
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
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
// @desc    Get messages for a specific chat session
// @access  Private
router.get('/session/:sessionId', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { sessionId } = req.params;
    
    const messages = await Message.find({ 
      userId, 
      chatSessionId: sessionId 
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
    
    res.json({ message: 'Chat session deleted successfully' });
  } catch (error) {
    console.error('Delete session error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;