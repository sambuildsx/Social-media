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

// FOLLOW USER
const followUser = async()=>{

await api.post(`/follow/${profile.user._id}`);

setProfile({
...profile,
isFollowing:true,
followersCount:profile.followersCount+1
});

};

// UNFOLLOW USER
const unfollowUser = async()=>{

await api.delete(`/follow/${profile.user._id}`);

setProfile({
...profile,
isFollowing:false,
followersCount:profile.followersCount-1
});

};

if(!profile) return <p className="text-center mt-10">Loading...</p>;

return(

<div className="max-w-3xl mx-auto text-white">

{/* PROFILE HEADER */}

<div className="flex items-center gap-6 border-b border-[#1E293B] pb-6">

<div className="w-20 h-20 bg-cyan-500 rounded-full flex items-center justify-center text-2xl font-bold">
{profile.user.username.charAt(0).toUpperCase()}
</div>

<div>

<h2 className="text-2xl font-semibold">
{profile.user.username}
</h2>

<p className="text-gray-400">
{profile.user.email}
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

<div className="grid grid-cols-2 gap-4 mt-6">

{profile.posts.map(post=>(

<div
key={post._id}
className="bg-[#121212] border border-[#1E293B] rounded-lg p-4"
>

<p>{post.content}</p>

</div>

))}

</div>

</div>

);
}