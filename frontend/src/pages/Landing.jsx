import SplitText from "../components/SplitText";
import GravityStarsBackground from "../components/GravityStarsBackground";

export default function Landing({ setPage }) {

  return (

    <div className="relative min-h-screen bg-[#0B0B0F] text-white overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0">
        <GravityStarsBackground />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-6">

        <SplitText
          text="Your Tech Workspace"
          className="text-6xl font-bold mb-6"
        />

        <p className="text-gray-400 mb-10">
          A keyboard-first productivity hub for developers and creators.
        </p>

        <input
          placeholder="Search commands..."
          className="w-full max-w-xl px-6 py-4 rounded-xl bg-[#121212] border border-[#1E293B] outline-none focus:border-cyan-400"
        />

        <div className="flex gap-4 mt-8">

          <button
            onClick={() => setPage("login")}
            className="px-6 py-2 bg-cyan-500 rounded-lg"
          >
            Login
          </button>

          <button
            onClick={() => setPage("signup")}
            className="px-6 py-2 border border-cyan-500 rounded-lg"
          >
            Signup
          </button>

        </div>

      </div>

    </div>

  );

}