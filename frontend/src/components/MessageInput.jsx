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

<div className="p-3 border-t border-[#1E293B] flex gap-3 items-center">

<input
value={text}
onChange={(e)=>setText(e.target.value)}
onKeyDown={(e) => e.key === "Enter" && send()}
placeholder="Type a message..."
className="flex-1 bg-[#121212] border border-[#1E293B] px-4 py-2 rounded-lg outline-none text-white"
/>

<button
  onClick={send}
  className="bg-cyan-500 text-black px-4 py-2 rounded-lg font-bold"
>
  Send
</button>

</div>

)
}