import SplitText from "../components/SplitText";
import GravityStarsBackground from "../components/GravityStarsBackground";

export default function Landing({ setPage }) {
  return (
    <div className="relative min-h-screen bg-background text-white overflow-hidden flex flex-col items-center justify-center">

      {/* BACKGROUND EFFECTS */}
      <div className="absolute inset-0 z-0">
        <GravityStarsBackground />
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-accentGlow blur-[120px] rounded-full mix-blend-screen opacity-50"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-600/20 blur-[150px] rounded-full mix-blend-screen opacity-40"></div>
      </div>

      {/* TOP LEFT BRANDING */}
      <div className="absolute top-6 left-8 z-20 flex items-center gap-3">
        <img src="/logo.png" alt="friend.ly" className="w-10 h-10 object-contain drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]" onError={(e) => e.target.style.display='none'} />
        <span className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-accent to-white">friend.ly</span>
      </div>

      {/* CONTENT */}
      <div className="relative z-10 w-full max-w-2xl px-6">

        {/* GLASS CONTAINER */}
        <div className="glass-panel flex flex-col items-center justify-center px-10 py-16 text-center transform transition-all hover:-translate-y-2 hover:shadow-glow-lg duration-500">
          
          <div className="mb-6">
            <img src="/logo.png" alt="Logo" className="w-16 h-16 mx-auto drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]" onError={(e) => e.target.style.display='none'} />
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter mb-6 text-white drop-shadow-md">
            Where Ideas Meet <span className="text-accent drop-shadow-[0_0_15px_rgba(6,182,212,0.6)]">People.</span>
          </h1>

          <p className="text-gray-300 text-lg mb-10 max-w-md mx-auto leading-relaxed">
            Connect, share, and build meaningful conversations in one modern space.
          </p>

          <div className="flex gap-6 justify-center w-full">
            <button
              onClick={() => setPage("login")}
              className="btn-primary w-40"
            >
              Login
            </button>

            <button
              onClick={() => setPage("signup")}
              className="btn-outline w-40"
            >
              Signup
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}