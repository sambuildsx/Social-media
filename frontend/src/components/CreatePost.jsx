import { useState } from "react"

export default function CreatePost(){

const [text,setText] = useState("")

return(

<div className="glass p-5 rounded-xl">

<textarea
placeholder="What's on your mind?"
value={text}
onChange={(e)=>setText(e.target.value)}
className="w-full resize-none"
/>

<div className="flex justify-end mt-3">

<button>
Post
</button>

</div>

</div>

)
}