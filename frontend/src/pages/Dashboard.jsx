import Feed from "./Feed";
import Chat from "./Chat";
import Profile from "./Profile";
import SearchUsers from "./SearchUsers";
import Messages from "./Messages";
import { useState, useEffect } from "react";
import api from "../api/axios";
import { Home, MessageSquare, Search, User, LogOut, Bell, Server } from "lucide-react";

export default function Dashboard(){
  const [page, setPage] = useState("feed");
  const [profileId, setProfileId] = useState(null);
  const [dmUserId, setDmUserId] = useState(null);
  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    async function fetchMe() {
      try {
        const res = await api.get("/profile/me");
        setCurrentUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      } catch (err) {
        console.error("Failed to load profile", err);
      }
    }
    fetchMe();
  }, [page]);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const res = await api.get("/notifications");
        setNotifications(res.data);
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      }
    }
    fetchNotifications();
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload();
  }

  function openProfile(id){
    setProfileId(id);
    setPage("profile");
  }

  function openDirectMessage(userId) {
    setDmUserId(userId);
    setPage("messages");
  }

  const navItems = [
    { id: "feed", label: "Feed", icon: Home },
    { id: "messages", label: "Messages", icon: MessageSquare },
    { id: "chat", label: "Servers", icon: Server },
    { id: "search", label: "Search", icon: Search },
    { id: "profile", label: "Profile", icon: User },
  ];

  return (
    <div className="min-h-screen flex bg-background text-white overflow-hidden relative">

      {/* LEFT SIDEBAR */}
      <aside className="w-64 border-r border-borderBase bg-surface backdrop-blur-xl flex flex-col p-6 h-screen sticky top-0 hidden md:flex z-10">
        
        {/* LOGO */}
        <div className="flex items-center gap-3 mb-10 pl-2">
          <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]" onError={(e) => e.target.style.display='none'} />
          <span className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-accent to-white">friend.ly</span>
        </div>

        {/* NAV ITEMS */}
        <nav className="flex-1 flex flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = page === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === "profile") setProfileId(null);
                  setPage(item.id);
                }}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                  ? "bg-accent/10 text-accent font-semibold shadow-[calc(inset)_2px_0_0_0_#06B6D4]" 
                  : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon size={22} className={isActive ? "text-accent" : "text-gray-500"} />
                {item.label}
              </button>
            )
          })}
        </nav>

        {/* LOGOUT / USER MINI PROFILE */}
        <div className="mt-auto border-t border-borderBase pt-6">
          <div 
            className="flex items-center gap-3 mb-4 cursor-pointer hover:bg-white/5 p-2 rounded-xl transition"
            onClick={() => {
              setProfileId(null);
              setPage("profile");
            }}
          >
            <div className="w-10 h-10 rounded-full bg-accent text-black flex items-center justify-center font-bold overflow-hidden shadow-glow">
              {currentUser?.avatar ? (
                <img src={currentUser.avatar} alt="Profile" className="w-full h-full object-cover rounded-full" />
              ) : (
                currentUser?.username?.charAt(0).toUpperCase() || "P"
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold truncate w-32">{currentUser?.realName || currentUser?.username}</span>
              <span className="text-xs text-gray-500 truncate w-32">@{currentUser?.username}</span>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-4 px-4 py-2 w-full text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
          >
            <LogOut size={20} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* CENTER CONTENT */}
      <main className="flex-1 overflow-y-auto h-screen relative scrollbar-hide">
        {/* Background glow behind feed */}
        <div className="absolute top-[10%] left-[50%] -translate-x-1/2 w-[600px] h-[600px] bg-accentGlow blur-[150px] rounded-full mix-blend-screen opacity-20 pointer-events-none z-0"></div>

        <div className={`p-6 md:p-10 ${(page === "chat" || page === "messages") ? "max-w-5xl" : "max-w-3xl"} mx-auto min-h-full relative z-10 w-full transition-all duration-300`}>
          {page==="feed" && <Feed openProfile={openProfile}/>}
          {page==="messages" && <Messages openProfile={openProfile} dmUserId={dmUserId} setDmUserId={setDmUserId} />}
          {page==="chat" && <Chat openProfile={openProfile}/>}
          {page==="search" && <SearchUsers openProfile={openProfile} />}
          {page==="profile" && <Profile userId={profileId} openDirectMessage={openDirectMessage} />}
        </div>
      </main>

      {/* RIGHT SIDEBAR (NOTIFICATIONS) */}
      <aside className="w-80 border-l border-borderBase bg-surface backdrop-blur-xl flex flex-col h-screen sticky top-0 hidden lg:flex z-10">
        <div className="p-6 border-b border-borderBase">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Bell size={20} className="text-accent" />
            Notifications
          </h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {notifications.length > 0 ? (
            notifications.map((notif) => (
              <div key={notif._id} className="p-3 rounded-lg bg-black/40 border border-white/5 hover:border-accent/30 transition cursor-pointer">
                <p className="text-sm text-gray-300">
                  <span className="font-bold text-white">{notif.fromUser?.username || "System"}</span> {notif.message}
                </p>
                <span className="text-xs text-gray-500 mt-1 block">
                  {new Date(notif.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center p-6 text-gray-500 flex flex-col items-center gap-2">
              <Bell size={32} className="opacity-20" />
              <p className="text-sm">You're all caught up!</p>
            </div>
          )}
        </div>
      </aside>

      {/* MOBILE BOTTOM NAV (Optional, minimal version) */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-borderBase bg-background/90 backdrop-blur-xl p-3 flex justify-around md:hidden z-50">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = page === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === "profile") setProfileId(null);
                setPage(item.id);
              }}
              className={`p-2 rounded-xl ${isActive ? "text-accent bg-accent/10" : "text-gray-500"}`}
            >
              <Icon size={24} />
            </button>
          )
        })}
      </div>

    </div>
  )
}