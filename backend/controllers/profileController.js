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

    const isFollowing = user.followers.some(id => id.toString() === req.user.id);

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

async function updateProfile(req, res) {
  try {
    const { avatar, realName, bio } = req.body;
    
    let updates = {};
    if (avatar !== undefined) updates.avatar = avatar;
    if (realName !== undefined) updates.realName = realName;
    if (bio !== undefined) updates.bio = bio;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true }
    ).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function searchUsers(req, res) {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);
    const users = await User.find({
      $or: [
        { username: { $regex: q, $options: "i" } },
        { realName: { $regex: q, $options: "i" } }
      ]
    }).select("-password").limit(20);
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  getMyProfile,
  getUserProfile,
  updateProfile,
  searchUsers
};