import { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";

export default function Auth({ setIsLoggedIn }) {

  const [mode,setMode] = useState(null);

  if(mode === "login"){
    return <Login setIsLoggedIn={setIsLoggedIn}/>
  }

  if(mode === "signup"){
    return <Signup setIsLoggedIn={setIsLoggedIn}/>
  }

  return (

    <div className="authPage">

      <h1>Nexora</h1>

      <p>Welcome to Nexora</p>

      <div>

        <button onClick={()=>setMode("login")}>
          Login
        </button>

        <button onClick={()=>setMode("signup")}>
          Signup
        </button>

      </div>

    </div>

  );

}