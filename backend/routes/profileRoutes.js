const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const profileController = require("../controllers/profileController");

// Get my profile
router.get("/me", auth, profileController.getMyProfile);

// Search users
router.get("/search", auth, profileController.searchUsers);

// Get another user's profile
router.get("/:userId", auth, profileController.getUserProfile);

// Update profile (e.g. avatar)
router.put("/", auth, profileController.updateProfile);

module.exports = router;