import Feed from "./Feed";
import Chat from "./Chat";
import Profile from "./Profile";
import SearchUsers from "./SearchUsers";
import { useState, useEffect } from "react";
import api from "../api/axios";

export default function Dashboard(){

const [page,setPage] = useState("feed")
const [profileId,setProfileId] = useState(null)
const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem("user")) || null)

useEffect(() => {
  async function fetchMe() {
    try {
      const res = await api.get("/profile/me");
      setCurrentUser(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));
    } catch (err) {
      console.error("Failed to load profile", err);
    }
  }
  fetchMe();
}, [page]);

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
onClick={() => setPage("search")}
className={`hover:text-white transition ${page === "search" ? "text-white" : ""}`}
>
Search
</button>

<button
onClick={() => {
setProfileId(null)
setPage("profile")
}}
className={`hover:opacity-80 transition flex items-center justify-center w-8 h-8 rounded-full ${currentUser?.avatar ? '' : 'bg-cyan-500 text-black font-bold'}`}
>
  {currentUser?.avatar ? (
    <img src={currentUser.avatar} alt="Profile" className="w-full h-full object-cover rounded-full" />
  ) : (
    currentUser?.username?.charAt(0).toUpperCase() || "P"
  )}
</button>

</div>

</div>


{/* CONTENT */}

<div className="flex-1 p-6">

{page==="feed" && <Feed openProfile={openProfile}/>}

{page==="chat" && <Chat/>}

{page==="search" && <SearchUsers openProfile={openProfile} />}

{page==="profile" && <Profile userId={profileId}/>}

</div>

</div>

)
}