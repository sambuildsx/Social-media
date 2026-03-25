import { useEffect,useState } from "react"
import api from "../api/axios"

export default function ServerList({serverId,setServerId}){

const [servers,setServers] = useState([])
const [isModalOpen, setIsModalOpen] = useState(false)
const [newServerName, setNewServerName] = useState("")

const [isJoinModalOpen, setIsJoinModalOpen] = useState(false)
const [joinServerId, setJoinServerId] = useState("")

useEffect(()=>{

async function fetchServers(){

try {
  const res = await api.get("/servers")
  setServers(res.data)
} catch (err) {
  console.error(err)
}

}

fetchServers()

},[])

async function createServer(){
  if(!newServerName.trim()) return
  try {
    const res = await api.post("/servers",{name: newServerName})
    setServers([...servers,res.data])
    setIsModalOpen(false)
    setNewServerName("")
  } catch (err) {
    alert("Failed to create server")
  }
}

async function joinServer() {
  if(!joinServerId.trim()) return
  try {
    await api.post(`/servers/${joinServerId}/join`)
    setIsJoinModalOpen(false)
    setJoinServerId("")
    // Refresh servers
    const res = await api.get("/servers")
    setServers(res.data)
  } catch (err) {
    alert("Failed to join server. Check ID.")
  }
}

return(

<div className="w-20 bg-[#111] border-r border-[#1E293B] flex flex-col items-center py-4 gap-4">

{servers.map(server=>(
<div
key={server._id}
onClick={()=>setServerId(server._id)}
className={`w-12 h-12 rounded-xl flex items-center justify-center cursor-pointer
${serverId===server._id ? "bg-cyan-500":"bg-[#1E293B]"}`}
>
{server.name[0]}
</div>
))}

<button
onClick={() => setIsModalOpen(true)}
className="w-12 h-12 rounded-xl bg-cyan-500 text-black font-bold shrink-0"
title="Create Server"
>
+
</button>

<button
onClick={() => setIsJoinModalOpen(true)}
className="w-12 h-12 rounded-xl bg-[#1E293B] text-cyan-500 font-bold shrink-0 hover:bg-cyan-500 hover:text-black transition"
title="Join Server"
>
🔍
</button>

{isModalOpen && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-[#121212] border border-[#1E293B] p-6 rounded-xl w-80">
      <h2 className="text-white text-xl font-bold mb-4">Create Server</h2>
      <input
        type="text"
        placeholder="Server name"
        value={newServerName}
        onChange={(e) => setNewServerName(e.target.value)}
        className="w-full px-4 py-2 bg-[#1E293B] text-white rounded-lg outline-none mb-4"
      />
      <div className="flex justify-end gap-3">
        <button onClick={() => { setIsModalOpen(false); setNewServerName(""); }} className="text-gray-400 hover:text-white px-4 py-2">
          Cancel
        </button>
        <button onClick={createServer} className="bg-cyan-500 text-black px-4 py-2 rounded-lg font-bold">
          Create
        </button>
      </div>
    </div>
  </div>
)}

{isJoinModalOpen && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-[#121212] border border-[#1E293B] p-6 rounded-xl w-80">
      <h2 className="text-white text-xl font-bold mb-4">Join Server</h2>
      <input
        type="text"
        placeholder="Enter Server ID"
        value={joinServerId}
        onChange={(e) => setJoinServerId(e.target.value)}
        className="w-full px-4 py-2 bg-[#1E293B] text-white rounded-lg outline-none mb-4"
      />
      <div className="flex justify-end gap-3">
        <button onClick={() => { setIsJoinModalOpen(false); setJoinServerId(""); }} className="text-gray-400 hover:text-white px-4 py-2">
          Cancel
        </button>
        <button onClick={joinServer} className="bg-cyan-500 text-black px-4 py-2 rounded-lg font-bold">
          Join
        </button>
      </div>
    </div>
  </div>
)}

</div>

)
}