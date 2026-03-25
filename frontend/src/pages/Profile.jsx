import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Profile({ userId }) {

const [profile,setProfile] = useState(null);

useEffect(()=>{

const loadProfile = async()=>{

let res;

if(userId){
res = await api.get(`/profile/${userId}`);
}else{
res = await api.get("/profile/me");
}

setProfile(res.data);

};

loadProfile();

},[userId]);

const handleImageUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("image", file);

  try {
    const res = await api.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    const imageUrl = res.data.imageUrl;

    const updateRes = await api.put("/profile", { avatar: imageUrl });
    setProfile({ ...profile, user: updateRes.data });
  } catch (err) {
    console.error("Error uploading image", err);
  }
};

// FOLLOW USER
const followUser = async()=>{
  try {
    await api.post(`/follow/${profile.user._id}`);
    setProfile({
      ...profile,
      isFollowing:true,
      followersCount:profile.followersCount+1
    });
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || "Failed to follow user");
  }
};

// UNFOLLOW USER
const unfollowUser = async()=>{
  try {
    await api.delete(`/follow/${profile.user._id}`);
    setProfile({
      ...profile,
      isFollowing:false,
      followersCount:profile.followersCount-1
    });
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || "Failed to unfollow user");
  }
};

if(!profile) return <p className="text-center mt-10">Loading...</p>;

return(

<div className="max-w-3xl mx-auto text-white">

{/* PROFILE HEADER */}

<div className="flex items-center gap-6 border-b border-[#1E293B] pb-6">

<label className={`w-20 h-20 bg-cyan-500 rounded-full flex items-center justify-center text-2xl font-bold shrink-0 ${!userId ? 'cursor-pointer' : ''}`}>
  {profile.user.avatar ? (
    <img src={profile.user.avatar} alt="Avatar" className="w-full h-full object-cover rounded-full" />
  ) : (
    profile.user.username.charAt(0).toUpperCase()
  )}
  {!userId && (
    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
  )}
</label>

<div>

<h2 className="text-2xl font-semibold">
{profile.user.realName} <span className="text-gray-400 text-lg">@{profile.user.username}</span>
</h2>

<p className="text-gray-400">
{profile.user.bio}
</p>

<div className="flex gap-6 text-gray-400 mt-2">

<span>{profile.posts.length} posts</span>
<span>{profile.followersCount} followers</span>
<span>{profile.followingCount} following</span>

</div>

</div>

{/* FOLLOW BUTTON */}

{userId && (

<div className="ml-auto">

{profile.isFollowing ? (

<button
onClick={unfollowUser}
className="bg-gray-700 px-4 py-2 rounded-lg"
>
Unfollow
</button>

) : (

<button
onClick={followUser}
className="bg-cyan-500 px-4 py-2 rounded-lg"
>
Follow
</button>

)}

</div>

)}

</div>


{/* POSTS */}

<div className="grid grid-cols-3 gap-1 md:gap-2 mt-8">

{profile.posts.map(post=>(

<div
  key={post._id}
  className="bg-[#1E293B] aspect-square rounded-md overflow-hidden relative group cursor-pointer"
>
  {post.image ? (
    <img src={post.image} className="w-full h-full object-cover" alt="Post" />
  ) : (
    <div className="w-full h-full flex items-center justify-center p-4">
      <p className="text-gray-400 text-xs md:text-sm text-center line-clamp-4">{post.content}</p>
    </div>
  )}

  {/* Hover Overlay */}
  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-white font-bold">
    <div className="flex items-center gap-2">
      <span>❤️</span>
      <span>{post.likes?.length || 0}</span>
    </div>
    <div className="flex items-center gap-2">
      <span>🔁</span>
      <span>{post.shares || 0}</span>
    </div>
  </div>

</div>

))}

</div>

</div>

);
}