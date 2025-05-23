const express = require('express');
const axios = require('axios');
const Message = require('../models/message');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/chat
// @desc    Send message to AI and get response
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.user.id;

    if (!content || content.trim() === '') {
      return res.status(400).json({ message: 'Message content is required' });
    }

    // Save user message to DB
    const userMessage = new Message({
      userId,
      role: 'user',
      content
    });

    await userMessage.save();

    // Get the last 10 messages for context
    const messageHistory = await Message.find({ userId })
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
    const assistantResponse = response.data.candidates[0].content.parts[0].text;

    // Save assistant response to DB
    const assistantMessage = new Message({
      userId,
      role: 'assistant',
      content: assistantResponse
    });

    await assistantMessage.save();

    res.json({
      message: assistantResponse,
      messageId: assistantMessage._id
    });
  } catch (error) {
    console.error('Chat error:', error.message);
    if (error.response) {
      console.error('Gemini API error:', error.response.data);
    }
    res.status(500).json({ message: 'Error processing your request' });
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

module.exports = router;