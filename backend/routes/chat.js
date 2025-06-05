const express = require("express");
const authMiddleware = require("../middleware/auth");
const chatController = require("../controllers/chatController");

const router = express.Router();

// Main chat routes
router.post("/", authMiddleware, chatController.sendMessage);
router.get("/history", authMiddleware, chatController.getHistory);
router.get("/sessions", authMiddleware, chatController.getSessions);
router.get("/session/:sessionId", authMiddleware, chatController.getSessionMessages);
router.delete("/history", authMiddleware, chatController.clearHistory);
router.delete("/session/:sessionId", authMiddleware, chatController.deleteSession);

// Follow-up and side thread routes
router.post("/followup", authMiddleware, chatController.followup);
router.post("/side-thread", authMiddleware, chatController.sideThread);
router.get("/side-thread/:mainThreadId/:linkedToMessageId/:selectedTextHash?", authMiddleware, chatController.getSideThread);
router.get("/side-thread-selections/:mainThreadId/:linkedToMessageId", authMiddleware, chatController.getSideThreadSelections);
router.get("/side-threads/:mainThreadId", authMiddleware, chatController.getAllSideThreads);

// Summary routes
router.get("/summary/:sessionId", authMiddleware, chatController.getSummary);
router.delete("/summary/:sessionId", authMiddleware, chatController.invalidateSummary);

module.exports = router;
