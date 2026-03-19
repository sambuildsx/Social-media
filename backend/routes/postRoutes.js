const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");

const postController = require("../controllers/postController");

router.post("/", auth, postController.createPost);

router.get("/feed", auth, postController.getFeed);

router.post("/:postId/like", auth, postController.likePost);

router.post("/:postId/share", auth, postController.sharePost);

module.exports = router;