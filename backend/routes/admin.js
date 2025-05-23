const express = require('express');
const User = require('../models/user');
const Message = require('../models/message');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Admin middleware - Check if the user is an admin
const isAdmin = async (req, res, next) => {
  try {
    // In a real app, you would have an isAdmin field in your user model
    // For simplicity, we'll assume the first user in the database is an admin
    const adminEmail = req.user.email;
    const firstUser = await User.findOne().sort({ createdAt: 1 });
    
    if (firstUser && firstUser.email === adminEmail) {
      next();
    } else {
      res.status(403).json({ message: 'Access denied: Admin privileges required' });
    }
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Admin
router.get('/users', [authMiddleware, isAdmin], async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash');
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/stats
// @desc    Get system stats
// @access  Admin
router.get('/stats', [authMiddleware, isAdmin], async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const messageCount = await Message.countDocuments();
    
    const userMessages = await Message.countDocuments({ role: 'user' });
    const assistantMessages = await Message.countDocuments({ role: 'assistant' });
    
    res.json({
      userCount,
      messageCount,
      userMessages,
      assistantMessages
    });
  } catch (error) {
    console.error('Get stats error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/admin/users/:userId
// @desc    Delete a user
// @access  Admin
router.delete('/users/:userId', [authMiddleware, isAdmin], async (req, res) => {
  try {
    const userId = req.params.userId;
    
    await User.findByIdAndDelete(userId);
    await Message.deleteMany({ userId });
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/admin/messages/:userId
// @desc    Delete all messages for a user
// @access  Admin
router.delete('/messages/:userId', [authMiddleware, isAdmin], async (req, res) => {
  try {
    const userId = req.params.userId;
    
    await Message.deleteMany({ userId });
    
    res.json({ message: 'User messages deleted successfully' });
  } catch (error) {
    console.error('Delete messages error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;