const Message = require("../models/message");

async function getMessages(req, res) {

  try {

    const { channelId } = req.params;

    const messages = await Message.find({ channel: channelId })
      .sort({ createdAt: 1 });

    res.json(messages);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Server error"
    });

  }

}

module.exports = { getMessages };