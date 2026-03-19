import { useEffect,useState } from "react";
import api from "../api/axios";

export default function Channels({serverId}){

  const [channels,setChannels] = useState([]);

  useEffect(()=>{

    const fetchChannels = async ()=>{

      const res = await api.get(`/channels/${serverId}`);

      setChannels(res.data);
    };

    fetchChannels();

  },[serverId]);

  return(

    <div>

      {channels.map(channel=>(
        <div key={channel._id}>
          #{channel.name}
        </div>
      ))}

    </div>
  );
}