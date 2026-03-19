const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const { getMessages } = require("../controllers/messageController");

router.get("/:channelId", auth, getMessages);

module.exports = router;