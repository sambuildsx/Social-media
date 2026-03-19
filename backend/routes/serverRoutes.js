const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const serverController = require("../controllers/serverController");
const loadServer = require("../middlewares/loadServer");
const { checkRole } = require("../middlewares/checkRole");

router.get("/", auth, serverController.getServers);

router.post("/", auth, serverController.createServer);

router.post(
  "/:serverId/join",
  auth,
  loadServer,
  serverController.joinServer
);

router.patch(
  "/:serverId/promote",
  auth,
  loadServer,
  checkRole(["owner"]),
  serverController.promoteMember
);

module.exports = router; 