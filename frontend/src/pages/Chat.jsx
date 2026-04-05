import { useState, useEffect } from "react";
import ServerList from "../components/ServerList";
import ChannelList from "../components/ChannelList";
import MessageList from "../components/MessageList";
import MessageInput from "../components/MessageInput";
import socket from "../socket/socket";

export default function Chat({ openProfile }){

const [serverId,setServerId] = useState(null)
const [channelId,setChannelId] = useState(null)

useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) {
    socket.auth = { token };
    socket.connect();
  }

  return () => {
    socket.disconnect();
  };
}, []);

return(

<div className="flex h-[85vh] overflow-hidden glass-panel">

<ServerList
serverId={serverId}
setServerId={setServerId}
/>

<ChannelList
serverId={serverId}
channelId={channelId}
setChannelId={setChannelId}
/>

<div className="flex-1 flex flex-col">

<div className="flex-1 overflow-y-auto p-4">
<MessageList channelId={channelId} openProfile={openProfile}/>
</div>

<MessageInput channelId={channelId}/>

</div>

</div>

)
}