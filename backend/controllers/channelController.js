const Channel = require("../models/channel");

async function createChannel(req, res) {
  const { name } = req.body;

  const channel = await Channel.create({
    name,
    server: req.server._id,
    createdBy: req.user.id,
  });

  res.status(201).json(channel);
}

async function getChannels(req, res) {
  const channels = await Channel.find({
    server: req.server._id,
  }).sort({ createdAt: 1 });

  res.json(channels);
}

async function deleteChannel(req, res) {
  const { channelId } = req.params;

  const channel = await Channel.findOne({
    _id: channelId,
    server: req.server._id,
  });

  if (!channel) {
    return res.status(404).json({ message: "Channel not found" });
  }

  await channel.deleteOne();

  res.json({ message: "Channel deleted" });
}

module.exports = {
  createChannel,
  getChannels,
  deleteChannel,
};