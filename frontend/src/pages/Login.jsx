import { useState } from "react";

export default function Login({ setPage }) {

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  async function handleLogin(){

    const res = await fetch("http://localhost:5000/api/auth/login",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body: JSON.stringify({
        email,
        password
      })
    });

    const data = await res.json();

    if(res.ok){

      localStorage.setItem("token",data.token);
      localStorage.setItem("user",JSON.stringify(data.user));

      setPage("dashboard");

    }else{
      alert(data.message);
    }

  }

  return (

    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] text-white">

      <div className="flex flex-col gap-4 w-80">

        <h1 className="text-3xl font-bold">Login</h1>

        <input
          placeholder="Email"
          onChange={(e)=>setEmail(e.target.value)}
          className="px-4 py-3 bg-[#121212] border border-[#1E293B] rounded-lg"
        />

        <input
          placeholder="Password"
          type="password"
          onChange={(e)=>setPassword(e.target.value)}
          className="px-4 py-3 bg-[#121212] border border-[#1E293B] rounded-lg"
        />

        <button
          className="bg-cyan-500 py-3 rounded-lg"
          onClick={handleLogin}
        >
          Login
        </button>

        <p
          className="text-cyan-400 cursor-pointer"
          onClick={() => setPage("signup")}
        >
          Create account
        </p>

      </div>

    </div>
  );
}