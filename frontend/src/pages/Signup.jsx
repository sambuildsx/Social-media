import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function Signup({ setPage }) {
  const [realName, setRealName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
    <div className="relative min-h-screen flex items-center justify-center bg-background text-white overflow-hidden">
      
      {/* Background blobs */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-accentGlow blur-[120px] rounded-full mix-blend-screen opacity-50 pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-600/20 blur-[150px] rounded-full mix-blend-screen opacity-40 pointer-events-none"></div>

      <div className="glass-panel flex flex-col items-center w-full max-w-sm px-8 py-10 z-10">
        
        <div className="mb-4">
          <img src="/logo.png" alt="Logo" className="w-12 h-12 mx-auto drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]" onError={(e) => e.target.style.display='none'} />
        </div>

        <h1 className="text-3xl font-extrabold mb-8 drop-shadow-md">Create Account</h1>

        <div className="w-full flex flex-col gap-4">
          <input
            placeholder="Real Name"
            onChange={(e)=>setRealName(e.target.value)}
            className="glass-input"
          />

          <input
            placeholder="Username"
            onChange={(e)=>setUsername(e.target.value)}
            className="glass-input"
          />

          <input
            placeholder="Email"
            onChange={(e)=>setEmail(e.target.value)}
            className="glass-input"
          />

          <div className="relative w-full">
            <input
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              onChange={(e)=>setPassword(e.target.value)}
              className="glass-input w-full pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-accent transition"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            className="btn-primary mt-4"
            onClick={handleSignup}
          >
            Signup
          </button>

          <p
            className="text-gray-400 text-sm mt-4 text-center"
          >
            Already have an account?{" "}
            <span 
              className="text-accent cursor-pointer hover:underline"
              onClick={() => setPage("login")}
            >
              Log in
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}