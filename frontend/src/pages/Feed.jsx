import { useState, useEffect } from "react";
import api from "../api/axios";

export default function Feed({ openProfile }) {

  const [posts,setPosts] = useState([]);
  const [content,setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);

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

    <div className="max-w-2xl mx-auto flex flex-col gap-6">

      {/* CREATE POST */}

      <div className="bg-[#121212] border border-[#1E293B] rounded-xl p-4">

        <textarea
          value={content}
          onChange={(e)=>setContent(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full bg-transparent text-white outline-none resize-none"
        />

        {imageFile && (
          <div className="mt-2 text-sm text-cyan-400">
            Selected Image: {imageFile.name}
          </div>
        )}

        <div className="flex justify-between items-center mt-3">
          <label className="cursor-pointer text-gray-400 hover:text-white">
            📷 Add Image
            <input type="file" className="hidden" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
          </label>

          <button
            onClick={createPost}
            className="bg-cyan-500 px-4 py-2 rounded-lg text-black font-semibold"
          >
            Post
          </button>
        </div>

      </div>


      {/* POSTS */}

      {posts.map(post=>(

        <div
          key={post._id}
          className="bg-[#121212] border border-[#1E293B] hover:bg-[#161616] transition cursor-default rounded-xl p-5"
        >
          <div className="flex gap-4">
            {/* AVATAR */}
            <div
              onClick={()=>openProfile(post.author._id)}
              className="w-12 h-12 bg-[#1E293B] rounded-full flex items-center justify-center font-bold text-white shrink-0 overflow-hidden cursor-pointer"
            >
              {post.author.avatar ? (
                <img src={post.author.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                post.author.username.charAt(0).toUpperCase()
              )}
            </div>

            <div className="flex-1">
              {/* USER INFO */}
              <div
                onClick={()=>openProfile(post.author._id)}
                className="cursor-pointer flex items-baseline gap-2 mb-1"
              >
                <span className="font-bold text-white hover:underline">{post.author.realName || post.author.username}</span>
                <span className="text-gray-500 text-sm">@{post.author.username}</span>
              </div>

              {/* CONTENT */}
              <p className="text-white text-[15px] leading-relaxed mb-3">
                {post.content}
              </p>

              {/* IMAGE */}
              {post.image && (
                <div className="mt-3 overflow-hidden rounded-2xl border border-[#1E293B]">
                  <img src={post.image} alt="Post image" className="w-full h-auto object-cover" />
                </div>
              )}

              {/* ACTIONS */}
              <div className="flex gap-12 mt-4 text-gray-500">
                <button 
                  onClick={()=>likePost(post._id)}
                  className="flex items-center gap-2 hover:text-pink-500 transition group"
                >
                  <div className="p-2 rounded-full group-hover:bg-pink-500/10">❤️</div>
                  <span className={`${post.likes.length > 0 ? "text-pink-500" : ""}`}>{post.likes.length}</span>
                </button>

                <button 
                  onClick={()=>sharePost(post._id)}
                  className="flex items-center gap-2 hover:text-green-500 transition group"
                >
                  <div className="p-2 rounded-full group-hover:bg-green-500/10">🔁</div>
                  <span className={`${post.shares > 0 ? "text-green-500" : ""}`}>{post.shares}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

      ))}

    </div>

  )

}