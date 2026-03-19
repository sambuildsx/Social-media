import { useState, useEffect } from "react";
import api from "../api/axios";

export default function Feed({ openProfile }) {

  const [posts,setPosts] = useState([]);
  const [content,setContent] = useState("");

  useEffect(()=>{

    loadFeed();

  },[]);

  async function loadFeed(){

    const res = await api.get("/posts/feed");

    setPosts(res.data);

  }

  async function createPost(){

    if(!content.trim()) return;

    const res = await api.post("/posts",{
      content
    });

    setPosts([res.data,...posts]);

    setContent("");

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

        <button
          onClick={createPost}
          className="mt-3 bg-cyan-500 px-4 py-2 rounded-lg"
        >
          Post
        </button>

      </div>


      {/* POSTS */}

      {posts.map(post=>(

        <div
          key={post._id}
          className="bg-[#121212] border border-[#1E293B] rounded-xl p-4"
        >

          {/* USER */}

          <div
          onClick={()=>openProfile(post.author._id)}
          className="cursor-pointer text-cyan-400"
          >
          {post.author.username}
          </div>
          {/* CONTENT */}

          <p className="text-gray-300 mt-2">
            {post.content}
          </p>


          {/* ACTIONS */}

          <div className="flex gap-6 mt-3 text-gray-400">

            <button onClick={()=>likePost(post._id)}>
              ❤️ {post.likes.length}
            </button>

            <button onClick={()=>sharePost(post._id)}>
              🔁 {post.shares}
            </button>

          </div>

        </div>

      ))}

    </div>

  )

}