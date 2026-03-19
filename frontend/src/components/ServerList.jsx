import { useEffect,useState } from "react"
import api from "../api/axios"

export default function ServerList({serverId,setServerId}){

const [servers,setServers] = useState([])

useEffect(()=>{

async function fetchServers(){

const res = await api.get("/servers")

setServers(res.data)

}

fetchServers()

},[])

async function createServer(){

const name = prompt("Server name")

if(!name) return

const res = await api.post("/servers",{name})

setServers([...servers,res.data])

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
onClick={createServer}
className="w-12 h-12 rounded-xl bg-cyan-500 text-black font-bold"
>
+
</button>

</div>

)
}