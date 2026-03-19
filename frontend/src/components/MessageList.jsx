import { useState } from "react"

export default function MessageInput(){

const [text,setText] = useState("")

return(

<input
value={text}
onChange={(e)=>setText(e.target.value)}
placeholder="Type a message..."
className="w-full"
/>

)
}