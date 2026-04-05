import { useState, useEffect, useRef } from "react";
import api from "../api/axios";
import { Send, User as UserIcon, ArrowLeft, MessageSquare } from "lucide-react";

export default function Messages({ openProfile, dmUserId, setDmUserId }) {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const messagesEndRef = useRef(null);
  const [activeUser, setActiveUser] = useState(null);

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const myId = currentUser.id || currentUser._id;

  // Load conversations on mount or when dmUserId changes
  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.get("/dm/conversations");
        setConversations(res.data);
        
        // If we navigated here with a specific user, we want to make sure they are in the list.
        if (dmUserId) {
          const userInList = res.data.find(u => u._id === dmUserId);
          if (!userInList) {
            // Fetch their details since they aren't in recent conversations
            const pRes = await api.get(`/profile/${dmUserId}`);
            
            setConversations(prev => {
              if (prev.find(u => u._id === pRes.data.user._id)) return prev;
              return [pRes.data.user, ...prev];
            });
            
            setActiveUser(pRes.data.user);
          } else {
            setActiveUser(userInList);
          }
        }
      } catch (err) {
        console.error("Failed to load conversations", err);
      }
    }
    loadData();
  }, []);

  // When activeUser changes (or dmUserId is set), load the chat
  useEffect(() => {
    if (dmUserId && !activeUser) return; // Wait until activeUser is resolved

    const targetId = activeUser?._id || dmUserId;
    if (!targetId) return;

    if (activeUser && activeUser._id !== dmUserId) {
      setDmUserId(activeUser._id);
    }

    async function fetchMessages() {
      try {
        const res = await api.get(`/dm/${targetId}`);
        setMessages(res.data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchMessages();
    
    // In a real app with socket.io support for DMs:
    // socket.emit("joinDm", targetId);
    // Add socket listeners here...
    
    // For now, we will just poll every few seconds
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);

  }, [activeUser, dmUserId, setDmUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    if (!content.trim() || !activeUser) return;
    
    try {
      const res = await api.post(`/dm/${activeUser._id}`, { content });
      setMessages([...messages, res.data]);
      setContent("");
      
      // Ensure user is at the top of conversations if this is first message
      const isNew = !conversations.find(u => u._id === activeUser._id);
      if (isNew) {
        setConversations([activeUser, ...conversations]);
      }
    } catch (err) {
      console.error("Failed to send message", err);
    }
  }

  return (
    <div className="flex h-[80vh] border border-borderBase rounded-xl overflow-hidden glass-panel">
      
      {/* CONVERSATIONS SIDEBAR */}
      <div className={`w-80 border-r border-borderBase bg-black/40 flex flex-col ${activeUser ? 'hidden md:flex' : 'flex w-full md:w-80'}`}>
        <div className="p-5 border-b border-borderBase">
          <h2 className="text-xl font-bold">Messages</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          {conversations.length === 0 ? (
            <div className="text-center p-6 text-gray-500">No active conversations yet</div>
          ) : (
            conversations.map(user => (
              <div 
                key={user._id}
                onClick={() => setActiveUser(user)}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition ${activeUser?._id === user._id ? 'bg-accent/10 border border-accent/30' : 'hover:bg-white/5 border border-transparent'}`}
              >
                <div className="w-12 h-12 rounded-full bg-borderBase shrink-0 flex items-center justify-center font-bold overflow-hidden shadow-glow">
                  {user.avatar ? (
                    <img src={user.avatar} className="w-full h-full object-cover" alt="avatar" />
                  ) : (
                    user.username.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="font-bold text-white truncate">{user.realName || user.username}</span>
                  <span className="text-sm text-gray-500 truncate">@{user.username}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* CHAT AREA */}
      {activeUser ? (
        <div className="flex-1 flex flex-col bg-surface relative">
          
          {/* Chat Header */}
          <div className="p-4 border-b border-borderBase flex items-center gap-4 bg-black/40">
            <button className="md:hidden p-2 text-gray-400 hover:text-white" onClick={() => { setActiveUser(null); setDmUserId(null); }}>
              <ArrowLeft size={20} />
            </button>
            <div 
              className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition"
              onClick={() => openProfile(activeUser._id)}
            >
              <div className="w-10 h-10 rounded-full bg-borderBase shrink-0 flex items-center justify-center font-bold overflow-hidden">
                {activeUser.avatar ? (
                  <img src={activeUser.avatar} className="w-full h-full object-cover" alt="avatar" />
                ) : (
                  activeUser.username.charAt(0).toUpperCase()
                )}
              </div>
              <span className="font-bold text-lg">{activeUser.realName || activeUser.username}</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
            {messages.length === 0 ? (
              <div className="m-auto text-gray-500 text-center">
                <UserIcon size={48} className="mx-auto mb-4 opacity-20" />
                <p>Start a conversation with @{activeUser.username}</p>
              </div>
            ) : (
              messages.map(msg => {
                const isMe = typeof msg.sender === 'object' ? msg.sender._id === myId : msg.sender === myId;
                
                return (
                  <div key={msg._id} className={`flex gap-3 max-w-[85%] ${isMe ? "ml-auto flex-row-reverse" : "mr-auto"}`}>
                    
                    {/* Avatar */}
                    {!isMe && (
                      <div 
                        className="w-8 h-8 bg-[#1E293B] rounded-full shrink-0 flex items-center justify-center font-bold text-white overflow-hidden mt-auto cursor-pointer border border-white/5 hover:border-accent/50 transition"
                        onClick={() => openProfile && openProfile(activeUser._id)}
                      >
                        {activeUser.avatar ? (
                          <img src={activeUser.avatar} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          activeUser.username?.charAt(0).toUpperCase() || "?"
                        )}
                      </div>
                    )}

                    <div className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                      {!isMe && (
                        <span 
                          className="font-bold text-gray-400 hover:text-white text-xs mb-1 ml-1 cursor-pointer transition"
                          onClick={() => openProfile && openProfile(activeUser._id)}
                        >
                          {activeUser.username || "Unknown"}
                        </span>
                      )}
                      
                      {/* Bubble */}
                      <div className={`px-4 py-2 ${isMe ? "bg-cyan-500 text-black rounded-2xl rounded-tr-sm" : "bg-[#1E293B] text-white rounded-2xl rounded-tl-sm"}`}>
                        <p className="whitespace-pre-wrap word-break">{msg.content}</p>
                      </div>

                      <span className="text-[10px] text-gray-600 mt-1 mx-1">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-borderBase bg-black/40">
            <div className="flex gap-2">
              <input
                type="text"
                value={content}
                onChange={e => setContent(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMessage()}
                placeholder="Type a message..."
                className="glass-input flex-1"
              />
              <button 
                onClick={sendMessage}
                className="bg-cyan-500 text-black px-4 rounded-xl font-bold flex items-center justify-center hover:scale-105 transition"
              >
                <Send size={20} />
              </button>
            </div>
          </div>

        </div>
      ) : (
        <div className="hidden md:flex flex-1 items-center justify-center bg-surface">
          <div className="text-center text-gray-500 flex flex-col items-center">
            <MessageSquare size={64} className="opacity-10 mb-4" />
            <p className="text-xl font-semibold">Your Messages</p>
            <p className="text-sm mt-2 max-w-sm">Select a conversation from the sidebar or click "Message" on a user's profile to start chatting.</p>
          </div>
        </div>
      )}
    </div>
  );
}
