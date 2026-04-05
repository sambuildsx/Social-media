import { useEffect, useState, useRef } from "react";
import api from "../api/axios";
import socket from "../socket/socket";

export default function MessageList({ channelId, openProfile }) {
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  
  // Safe helper to grab user ID from cache
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const myId = currentUser.id || currentUser._id;

  useEffect(() => {
    if (!channelId) return;

    async function fetchMessages() {
      try {
        const res = await api.get(`/messages/${channelId}`);
        setMessages(res.data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchMessages();
    socket.emit("joinChannel", channelId);

    const handleNewMessage = (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    };

    socket.on("receiveMessage", handleNewMessage);

    return () => {
      socket.off("receiveMessage", handleNewMessage);
    };
  }, [channelId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!channelId) return <div className="flex-1 flex items-center justify-center text-gray-400">Select a channel to start chatting</div>;

  return (
    <div className="flex flex-col gap-4">
      {messages.map((message) => {
        // Handle deeply populated sender or flat string ID
        const senderId = message.sender?._id || message.sender;
        const isMe = senderId === myId;

        return (
          <div key={message._id} className={`flex gap-3 max-w-[85%] ${isMe ? "ml-auto flex-row-reverse" : "mr-auto"}`}>
            
            {/* Avatar */}
            {!isMe && (
              <div 
                className="w-8 h-8 bg-[#1E293B] rounded-full shrink-0 flex items-center justify-center font-bold text-white overflow-hidden mt-auto cursor-pointer border border-white/5 hover:border-accent/50 transition"
                onClick={() => openProfile && openProfile(senderId)}
              >
                {message.sender?.avatar ? (
                  <img src={message.sender.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  message.sender?.username?.charAt(0).toUpperCase() || "?"
                )}
              </div>
            )}

            <div className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
              {!isMe && (
                <span 
                  className="font-bold text-gray-400 hover:text-white text-xs mb-1 ml-1 cursor-pointer transition"
                  onClick={() => openProfile && openProfile(senderId)}
                >
                  {message.sender?.username || "Unknown"}
                </span>
              )}
              
              {/* Bubble */}
              <div className={`px-4 py-2 ${isMe ? "bg-cyan-500 text-black rounded-2xl rounded-tr-sm" : "bg-[#1E293B] text-white rounded-2xl rounded-tl-sm"}`}>
                <p className="whitespace-pre-wrap word-break">{message.content}</p>
              </div>

              <span className="text-[10px] text-gray-600 mt-1 mx-1">
                {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}