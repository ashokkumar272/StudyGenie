const mongoose = require('mongoose');

const SummarySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    chatSessionId: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    totalMainMessages: {
        type: Number,
        required: true
    },
    totalSideMessages: {
        type: Number,
        required: true
    },
    mainThreadsWithSideThreads: {
        type: Number,
        required: true
    },
    rawConversation: {
        type: String,
        required: true
    },
    // Track when summary was generated
    generatedAt: {
        type: Date,
        default: Date.now
    },
    // Track the last message timestamp when summary was generated
    // This helps determine if summary needs to be regenerated
    lastMessageTimestamp: {
        type: Date,
        required: true
    },
    // Checksum or hash of the conversation content
    // Used to detect if content has changed
    contentHash: {
        type: String,
        required: true
    }
});

// Create compound index for efficient queries
SummarySchema.index({ userId: 1, chatSessionId: 1 }, { unique: true });

module.exports = mongoose.model('Summary', SummarySchema);
