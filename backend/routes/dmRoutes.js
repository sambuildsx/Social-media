const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const DirectMessage = require("../models/directMessage");
const User = require("../models/user");

// Get list of users I have conversed with
router.get("/conversations", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Find all messages where I am sender or receiver
    const messages = await DirectMessage.find({
      $or: [{ sender: userId }, { receiver: userId }]
    }).sort({ createdAt: -1 });

    // Extract unique users
    const userIds = new Set();
    messages.forEach(msg => {
      if (msg.sender.toString() !== userId) userIds.add(msg.sender.toString());
      if (msg.receiver.toString() !== userId) userIds.add(msg.receiver.toString());
    });

    const activeUsers = await User.find({ _id: { $in: Array.from(userIds) } })
      .select("username realName avatar");

    res.json(activeUsers);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get messages with a specific user
router.get("/:otherUserId", auth, async (req, res) => {
  try {
    const messages = await DirectMessage.find({
      $or: [
        { sender: req.user.id, receiver: req.params.otherUserId },
        { sender: req.params.otherUserId, receiver: req.user.id }
      ]
    })
    .populate("sender", "username avatar")
    .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Send a message
router.post("/:otherUserId", auth, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: "Content is required" });

    const newMsg = await DirectMessage.create({
      sender: req.user.id,
      receiver: req.params.otherUserId,
      content
    });

    await newMsg.populate("sender", "username avatar");
    res.json(newMsg);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
