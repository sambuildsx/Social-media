const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth");
const Notification = require("../models/notification");

// Get user notifications
router.get("/", authMiddleware, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.userId })
      .sort({ createdAt: -1 })
      .populate("fromUser", "username avatar realName")
      .limit(20);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Mark as read
router.post("/read/:id", authMiddleware, async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { read: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
