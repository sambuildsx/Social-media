import { useState } from "react"
import socket from "../socket/socket"

export default function MessageInput({channelId}){

const [text,setText] = useState("")

function send(){

if(!text || !channelId) return

socket.emit("sendMessage",{
channelId,
content:text
})

setText("")

}

return(

<div className="p-3 border-t border-[#1E293B]">

<input
value={text}
onChange={(e)=>setText(e.target.value)}
placeholder="Type a message..."
className="w-full bg-[#121212] border border-[#1E293B] px-4 py-2 rounded-lg outline-none"
/>

</div>

)
}