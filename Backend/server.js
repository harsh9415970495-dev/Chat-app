const app = require("express")();
const http = require("http");
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("chat", (payload) => {
    console.log("Received:", payload);
    io.emit("chat", payload);
  });
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});
