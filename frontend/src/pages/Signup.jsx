import { useState } from "react";

export default function Signup({ setPage }) {

  const [realName, setRealName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSignup() {

    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        realName,
        username,
        email,
        password
      })
    });

    const data = await res.json();

    if (res.ok) {

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setPage("dashboard");

    } else {
      alert(data.message);
    }

  }

  return (

    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] text-white">

      <div className="flex flex-col gap-4 w-80">

        <h1 className="text-3xl font-bold">Signup</h1>

        <input
          placeholder="Real Name"
          onChange={(e)=>setRealName(e.target.value)}
          className="px-4 py-3 bg-[#121212] border border-[#1E293B] rounded-lg"
        />

        <input
          placeholder="Username"
          onChange={(e)=>setUsername(e.target.value)}
          className="px-4 py-3 bg-[#121212] border border-[#1E293B] rounded-lg"
        />

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
          onClick={handleSignup}
        >
          Signup
        </button>

        <p
          className="text-cyan-400 cursor-pointer"
          onClick={() => setPage("login")}
        >
          Already have an account?
        </p>

      </div>

    </div>
  );
}