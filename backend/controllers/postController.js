const Post = require("../models/post");

async function createPost(req,res){

  try{

    const { content, image } = req.body;

    const post = await Post.create({
      content,
      image,
      author:req.user.id
    });
    
    await post.populate("author","username realName avatar");
    
    res.status(201).json(post);

  }catch(err){

    console.error(err);

    res.status(500).json({
      message:"Server error"
    });

  }

}

async function getFeed(req,res){

    try{
  
      const User = require("../models/user");
  
      const user = await User.findById(req.user.id);
  
      const posts = await Post.find({
        author:{ $in:[...user.following,req.user.id] }
      })
      .populate("author","username realName avatar")
      .sort({createdAt:-1});
  
      res.json(posts);
  
    }catch(err){
  
      console.error(err);
  
      res.status(500).json({message:"Server error"});
  
    }
  
  }

  async function likePost(req,res){

    const { postId } = req.params;
  
    const post = await Post.findById(postId);
  
    if(!post) return res.status(404).json({
      message:"Post not found"
    });
  
    if(post.likes.includes(req.user.id)){
      return res.status(400).json({
        message:"Already liked"
      });
    }
  
    post.likes.push(req.user.id);
  
    await post.save();
  
    res.json(post);
  
  }

  async function sharePost(req,res){

    const { postId } = req.params;
  
    const post = await Post.findById(postId);
  
    if(!post) return res.status(404).json({
      message:"Post not found"
    });
  
    post.shares += 1;
  
    await post.save();
  
    res.json(post);
  
  }

module.exports = {
  createPost,
  getFeed,
  likePost,
  sharePost
};