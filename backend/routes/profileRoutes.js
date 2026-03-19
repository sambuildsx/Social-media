const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const profileController = require("../controllers/profileController");

// Get my profile
router.get("/me", auth, profileController.getMyProfile);

// Get another user's profile
router.get("/:userId", auth, profileController.getUserProfile);

module.exports = router;