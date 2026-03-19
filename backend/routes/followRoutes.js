const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");

const followController = require("../controllers/followController");

router.post("/:userId", auth, followController.followUser);

router.delete("/:userId", auth, followController.unfollowUser);

module.exports = router;