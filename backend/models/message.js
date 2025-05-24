const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    chatSessionId: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'assistant'],
        required: true
    },
    content: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    // Chat type: main for regular chat, side for follow-up threads
    chatType: {
        type: String,
        enum: ['main', 'side'],
        default: 'main'
    },
    // For side threads, reference to the main thread
    mainThreadId: {
        type: String,
        default: null
    },
    // Parent message for replies
    parentMessageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
        default: null
    },
    // Which main message this side thread is linked to
    linkedToMessageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
        default: null
    },
    // Selected text for side threads
    selectedText: {
        type: String,
        default: null
    },
    // Legacy fields for backward compatibility
    fullAssistantMessage: {
        type: String,
        default: null
    },
    replyToMessageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
        default: null
    }
});

module.exports = mongoose.model('Message', MessageSchema);
