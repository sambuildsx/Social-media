import { useState, useEffect } from "react";
import api from "../api/axios";
import { Heart, MessageCircle, Repeat, Bookmark, Image as ImageIcon, Send } from "lucide-react";

export default function Feed({ openProfile }) {
  const [posts,setPosts] = useState([]);
  const [content,setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem("user")) || null);

  useEffect(()=>{
    loadFeed();
  },[]);

  async function loadFeed(){
    const res = await api.get("/posts/feed");
    setPosts(res.data);
  }

  async function createPost(){
    if(!content.trim() && !imageFile) return;
    let imageUrl = "";

    if (imageFile) {
      const formData = new FormData();
      formData.append("image", imageFile);
      const uploadRes = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      imageUrl = uploadRes.data.imageUrl;
    }

    const res = await api.post("/posts",{
      content,
      image: imageUrl
    });

    setPosts([res.data,...posts]);
    setContent("");
    setImageFile(null);
  }

  async function likePost(id){
    const res = await api.post(`/posts/${id}/like`);
    setPosts(posts.map(post=>
      post._id===id ? res.data : post
    ));
  }

  async function sharePost(id){
    const res = await api.post(`/posts/${id}/share`);
    setPosts(posts.map(post=>
      post._id===id ? res.data : post
    ));
  }

  return(
    <div className="flex flex-col gap-8 pb-20">

      {/* CREATE POST */}
      <div className="glass-panel p-5 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1/2 h-full bg-accent/5 blur-[50px] pointer-events-none transition-opacity opacity-0 group-hover:opacity-100"></div>
        
        <div className="flex gap-4 relative z-10">
          <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center font-bold text-accent shrink-0 overflow-hidden shadow-glow">
            {currentUser?.avatar ? (
              <img src={currentUser.avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              currentUser?.username?.charAt(0).toUpperCase() || "U"
            )}
          </div>
          
          <div className="flex-1 flex flex-col gap-3">
            <textarea
              value={content}
              onChange={(e)=>setContent(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full bg-transparent text-white outline-none resize-none placeholder-gray-500 text-lg mt-2"
              rows={2}
            />

            {imageFile && (
              <div className="text-sm text-accent bg-accent/10 px-3 py-1 rounded-md w-max border border-accent/20">
                Selected: {imageFile.name}
              </div>
            )}

            <div className="flex justify-between items-center border-t border-borderBase pt-3 mt-1">
              <label className="cursor-pointer flex items-center gap-2 text-gray-400 hover:text-accent transition-colors">
                <div className="p-2 rounded-full hover:bg-accent/10">
                  <ImageIcon size={20} />
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
              </label>

              <button
                onClick={createPost}
                className="btn-primary py-2 px-5 text-sm flex items-center gap-2"
              >
                Post <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>


      {/* POSTS */}
      <div className="flex flex-col gap-6">
        {posts.map(post=>(
          <div
            key={post._id}
            className="glass-panel p-5 transition-all duration-300 hover:shadow-glow hover:-translate-y-1 relative"
          >
            <div className="flex gap-4">
              {/* AVATAR */}
              <div
                onClick={()=>openProfile(post.author._id)}
                className="w-12 h-12 bg-borderBase rounded-full flex items-center justify-center font-bold text-white shrink-0 overflow-hidden cursor-pointer"
              >
                {post.author.avatar ? (
                  <img src={post.author.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  post.author.username.charAt(0).toUpperCase()
                )}
              </div>

              <div className="flex-1 min-w-0">
                {/* USER INFO */}
                <div
                  onClick={()=>openProfile(post.author._id)}
                  className="cursor-pointer flex items-baseline gap-2 mb-2"
                >
                  <span className="font-bold text-white hover:underline truncate">{post.author.realName || post.author.username}</span>
                  <span className="text-gray-500 text-sm truncate">@{post.author.username}</span>
                  <span className="text-gray-600 text-sm ml-auto shrink-0 border border-white/5 bg-white/5 px-2 rounded-full text-xs">
                    {new Date(post.createdAt || Date.now()).toLocaleDateString()}
                  </span>
                </div>

                {/* CONTENT */}
                <p className="text-gray-200 text-[15px] leading-relaxed mb-4 break-words">
                  {post.content}
                </p>

                {/* IMAGE */}
                {post.image && (
                  <div className="mb-4 overflow-hidden rounded-2xl border border-white/10 shadow-lg">
                    <img src={post.image} alt="Post image" className="w-full h-auto object-cover max-h-[500px]" />
                  </div>
                )}

                {/* ACTIONS */}
                <div className="flex gap-8 text-gray-400 mt-2">
                  <button 
                    onClick={()=>likePost(post._id)}
                    className="flex items-center gap-2 hover:text-pink-500 transition group"
                  >
                    <div className="p-2 rounded-full group-hover:bg-pink-500/10">
                      <Heart size={18} className={post.likes.length > 0 ? "fill-pink-500 text-pink-500" : ""} />
                    </div>
                    <span className={`text-sm ${post.likes.length > 0 ? "text-pink-500" : ""}`}>{post.likes.length}</span>
                  </button>

                  <button className="flex items-center gap-2 hover:text-accent transition group">
                    <div className="p-2 rounded-full group-hover:bg-accent/10">
                      <MessageCircle size={18} />
                    </div>
                    <span className="text-sm">0</span>
                  </button>

                  <button 
                    onClick={()=>sharePost(post._id)}
                    className="flex items-center gap-2 hover:text-green-500 transition group"
                  >
                    <div className="p-2 rounded-full group-hover:bg-green-500/10">
                      <Repeat size={18} />
                    </div>
                    <span className={`text-sm ${post.shares > 0 ? "text-green-500" : ""}`}>{post.shares}</span>
                  </button>
                  
                  <button className="flex items-center gap-2 hover:text-yellow-500 transition group ml-auto">
                    <div className="p-2 rounded-full group-hover:bg-yellow-500/10">
                      <Bookmark size={18} />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}