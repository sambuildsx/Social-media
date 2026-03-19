const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const loadServer = require("../middlewares/loadServer");
const { checkRole } = require("../middlewares/checkRole");
const { checkMember } = require("../middlewares/checkMember");
const channelController = require("../controllers/channelController");

router.post(
  "/:serverId",
  auth,
  loadServer,
  checkRole(["owner", "admin"]),
  channelController.createChannel
);

router.get(
  "/:serverId",
  auth,
  loadServer,
  checkMember,
  channelController.getChannels
);

router.delete(
  "/:serverId/:channelId",
  auth,
  loadServer,
  checkRole(["owner", "admin"]),
  channelController.deleteChannel
);

module.exports = router;