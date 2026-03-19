const User = require("../models/user");
const Post = require("../models/post");

async function getMyProfile(req, res) {
  try {

    const user = await User.findById(req.user.id)
      .select("-password");

    const posts = await Post.find({
      author: req.user.id
    }).sort({ createdAt: -1 });

    res.json({
      user,
      posts,
      followersCount: user.followers.length,
      followingCount: user.following.length
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Server error"
    });

  }
}


async function getUserProfile(req, res) {
  try {

    const { userId } = req.params;

    const user = await User.findById(userId)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const posts = await Post.find({
      author: userId
    }).sort({ createdAt: -1 });

    const isFollowing = user.followers.includes(req.user.id);

    res.json({
      user,
      posts,
      followersCount: user.followers.length,
      followingCount: user.following.length,
      isFollowing
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Server error"
    });

  }
}

module.exports = {
  getMyProfile,
  getUserProfile
};