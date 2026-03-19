import { useEffect,useState } from "react"
import api from "../api/axios"

export default function ChannelList({serverId,channelId,setChannelId}){

const [channels,setChannels] = useState([])

useEffect(()=>{

if(!serverId) return

async function fetchChannels(){

const res = await api.get(`/channels/${serverId}`)

setChannels(res.data)

}

fetchChannels()

},[serverId])

async function createChannel(){

const name = prompt("Channel name")

if(!name) return

const res = await api.post(`/channels/${serverId}`,{name})

setChannels([...channels,res.data])

}

return(

<div className="w-56 bg-[#121212] border-r border-[#1E293B] p-4">

<p className="text-gray-400 text-sm mb-3">
Channels
</p>

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

<button
onClick={createChannel}
className="mt-4 text-cyan-400 text-sm"
>
+ Create Channel
</button>

</div>

)
}