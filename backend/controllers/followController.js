const User = require("../models/user");

async function followUser(req,res){

  const { userId } = req.params;

  const me = await User.findById(req.user.id);
  const user = await User.findById(userId);

  if(!user) return res.status(404).json({message:"User not found"});

  if(me.following.includes(userId)){
    return res.status(400).json({message:"Already following"});
  }

  me.following.push(userId);
  user.followers.push(me._id);

  await me.save();
  await user.save();

  res.json({message:"Followed successfully"});
}

async function unfollowUser(req,res){

  const { userId } = req.params;

  const me = await User.findById(req.user.id);
  const user = await User.findById(userId);

  me.following = me.following.filter(
    id=>id.toString()!==userId
  );

  user.followers = user.followers.filter(
    id=>id.toString()!==req.user.id
  );

  await me.save();
  await user.save();

  res.json({message:"Unfollowed"});
}

module.exports={
  followUser,
  unfollowUser
};