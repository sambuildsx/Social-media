import Feed from "./Feed";
import Chat from "./Chat";
import Profile from "./Profile";
import { useState } from "react";

export default function Dashboard(){

const [page,setPage] = useState("feed")
const [profileId,setProfileId] = useState(null)

function openProfile(id){
  setProfileId(id)
  setPage("profile")
}

return(

<div className="min-h-screen flex flex-col bg-[#0A0A0A] text-white">

{/* NAVBAR */}

<div className="flex justify-between items-center px-8 py-4 border-b border-[#1E293B] bg-[#0A0A0A]">

<h1 className="text-xl font-semibold text-cyan-400 tracking-wide">
Nexora
</h1>

<div className="flex items-center gap-8 text-gray-400 text-sm font-medium">

<button
onClick={() => setPage("feed")}
className={`hover:text-white transition ${page === "feed" ? "text-white" : ""}`}
>
Feed
</button>

<button
onClick={() => setPage("chat")}
className={`hover:text-white transition ${page === "chat" ? "text-white" : ""}`}
>
Chat
</button>

<button
onClick={() => {
setProfileId(null)
setPage("profile")
}}
className={`hover:text-white transition ${page === "profile" ? "text-white" : ""}`}
>
Profile
</button>

</div>

</div>


{/* CONTENT */}

<div className="flex-1 p-6">

{page==="feed" && <Feed openProfile={openProfile}/>}

{page==="chat" && <Chat/>}

{page==="profile" && <Profile userId={profileId}/>}

</div>

</div>

)
}