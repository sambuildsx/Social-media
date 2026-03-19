import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Servers(){

  const [servers,setServers] = useState([]);

  useEffect(()=>{

    const fetchServers = async () => {

      const res = await api.get("/servers");

      setServers(res.data);
    };

    fetchServers();

  },[]);

  return(

    <div>

      <h2>Your Servers</h2>

      {servers.map((server)=>(
        <div key={server._id}>
          {server.name}
        </div>
      ))}

    </div>
  );
}