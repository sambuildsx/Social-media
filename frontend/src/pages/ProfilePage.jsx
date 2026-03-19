import { useEffect,useState } from "react"
import api from "../api/axios"

export default function ProfilePage({userId}){

const [profile,setProfile] = useState(null)

useEffect(()=>{

const loadProfile = async()=>{

const res = await api.get(`/profile/${userId}`)

setProfile(res.data)

}

loadProfile()

},[userId])

async function follow(){

await api.post(`/follow/${userId}`)

setProfile({
...profile,
isFollowing:true,
followersCount:profile.followersCount+1
})

}

async function unfollow(){

await api.delete(`/follow/${userId}`)

setProfile({
...profile,
isFollowing:false,
followersCount:profile.followersCount-1
})

}

if(!profile) return <p>Loading...</p>

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

<div className="flex gap-6 text-gray-400 mt-2">

<span>{profile.posts.length} posts</span>

<span>{profile.followersCount} followers</span>

<span>{profile.followingCount} following</span>

</div>

</div>

<div className="ml-auto">

{profile.isFollowing ? (

<button
onClick={unfollow}
className="bg-gray-700 px-4 py-2 rounded-lg"
>
Unfollow
</button>

) : (

<button
onClick={follow}
className="bg-cyan-500 px-4 py-2 rounded-lg"
>
Follow
</button>

)}

</div>

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

)

}