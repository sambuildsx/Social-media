import { useEffect,useState } from "react"
import api from "../api/axios"

export default function ChannelList({serverId,channelId,setChannelId}){

const [channels,setChannels] = useState([])
const [isModalOpen, setIsModalOpen] = useState(false)
const [newChannelName, setNewChannelName] = useState("")

useEffect(()=>{

if(!serverId) return

async function fetchChannels(){

const res = await api.get(`/channels/${serverId}`)

setChannels(res.data)

}

fetchChannels()

},[serverId])

async function createChannel(){
  if(!newChannelName.trim()) return
  try {
    const res = await api.post(`/channels/${serverId}`,{name: newChannelName})
    setChannels([...channels,res.data])
    setIsModalOpen(false)
    setNewChannelName("")
  } catch (err) {
    console.error(err)
    alert("Failed to create channel. You might not have permission.")
  }
}

return(

<div className="w-56 bg-[#121212] border-r border-[#1E293B] p-4">

<div className="flex items-center justify-between mb-3">
  <p className="text-gray-400 text-sm">Channels</p>
  {serverId && (
    <button 
      onClick={() => navigator.clipboard.writeText(serverId).then(() => alert("Server ID copied to clipboard!"))}
      className="text-xs bg-[#1E293B] hover:bg-cyan-500 hover:text-black text-cyan-400 px-2 py-1 rounded transition"
      title="Copy Server ID"
    >
      Copy ID
    </button>
  )}
</div>

<div className="flex flex-col gap-2">

{channels.map(channel=>(
<div
key={channel._id}
onClick={()=>setChannelId(channel._id)}
className={`px-3 py-2 rounded-lg cursor-pointer
${channelId===channel._id ? "bg-[#1E293B]" : "hover:bg-[#1E293B]"}`}
>
# {channel.name}
</div>
))}

</div>

{serverId && (
  <button
    onClick={() => setIsModalOpen(true)}
    className="mt-4 text-cyan-400 text-sm"
  >
  + Create Channel
  </button>
)}

{isModalOpen && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-[#121212] border border-[#1E293B] p-6 rounded-xl w-80">
      <h2 className="text-white text-xl font-bold mb-4">Create Channel</h2>
      <input
        type="text"
        placeholder="Channel name"
        value={newChannelName}
        onChange={(e) => setNewChannelName(e.target.value)}
        className="w-full px-4 py-2 bg-[#1E293B] text-white rounded-lg outline-none mb-4"
      />
      <div className="flex justify-end gap-3">
        <button onClick={() => { setIsModalOpen(false); setNewChannelName(""); }} className="text-gray-400 hover:text-white px-4 py-2">
          Cancel
        </button>
        <button onClick={createChannel} className="bg-cyan-500 text-black px-4 py-2 rounded-lg font-bold">
          Create
        </button>
      </div>
    </div>
  </div>
)}

</div>

)
}