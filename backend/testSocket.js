const { io } = require("socket.io-client");

console.log("Starting socket test...");

const socket = io("http://localhost:5000", {
  auth: {
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5YTliZjNjYWUwNDQ4NDU3Yzk2ZjYyMSIsImlhdCI6MTc3MjczNTg2NiwiZXhwIjoxNzczMzQwNjY2fQ.VJKAvUv5z4vfNM-t8w3zT9SSXKmnAXymhpfD14Hs1V4"
  },
  transports: ["websocket"]
});

// 👇 ADD THIS
const channelId = "69a9cca52d46be89cc9a2a1a";

socket.on("connect", () => {
  console.log("✅ Connected:", socket.id);

  socket.emit("joinChannel", channelId);

  setTimeout(() => {
    socket.emit("sendMessage", {
      channelId,
      content: "Hello from Sam"
    });
  }, 1000);
});

socket.on("receiveMessage", (msg) => {
  console.log("📩 Message received:", msg);
});

socket.on("connect_error", (err) => {
  console.log("❌ Connection error:", err.message);
});

socket.on("disconnect", (reason) => {
  console.log("⚠️ Disconnected:", reason);
});
//"",