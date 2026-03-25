import { useState } from "react";
import api from "../api/axios";

export default function SearchUsers({ openProfile }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  async function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;
    try {
      const res = await api.get(`/profile/search?q=${query}`);
      setResults(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      <form onSubmit={handleSearch} className="flex gap-4">
        <input 
          placeholder="Search for username or real name..." 
          value={query} 
          onChange={(e) => setQuery(e.target.value)} 
          className="flex-1 bg-[#121212] border border-[#1E293B] px-4 py-3 rounded-lg outline-none text-white"
        />
        <button type="submit" className="bg-cyan-500 text-black px-6 py-3 rounded-lg font-bold">Search</button>
      </form>
      
      <div className="flex flex-col gap-4">
        {results.map(user => (
          <div key={user._id} className="bg-[#121212] border border-[#1E293B] p-4 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#1E293B] rounded-full flex items-center justify-center text-xl font-bold text-white shrink-0">
                {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover rounded-full" alt="Avatar"/> : (user.username ? user.username.charAt(0).toUpperCase() : '?')}
              </div>
              <div>
                <p className="font-bold text-white">{user.realName}</p>
                <p className="text-gray-400 text-sm">@{user.username}</p>
              </div>
            </div>
            <button onClick={() => openProfile(user._id)} className="bg-[#1E293B] hover:bg-cyan-500 hover:text-black transition px-4 py-2 rounded-lg text-cyan-500 font-semibold shrink-0">
              View Profile
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
