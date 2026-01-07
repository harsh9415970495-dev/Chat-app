import { useState, useEffect } from "react";
import "./App.css";

import { io } from "socket.io-client";
import { nanoid } from "nanoid";

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [socket, setSocket] = useState(null);

  // create socket connection
  useEffect(() => {
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    newSocket.on("chat", (payload) => {
      console.log("Received from server:", payload); // 🔍 DEBUG
      setChat((prev) => [
        ...prev,
        { id: nanoid(), message: payload.message },
      ]);
    });

    return () => newSocket.disconnect();
  }, []);

  const sendChat = (e) => {
    e.preventDefault();
    if (!message.trim() || !socket) return;

    console.log("Sending:", message); // 🔍 DEBUG
    socket.emit("chat", { message });
    setMessage("");
  };

  return (
    <div className="dashboard">
      <div className="chat-container">
        <h1>Chatty App</h1>

        <div className="messages">
          {chat.map((c) => (
            <div key={c.id} className="message">
              {c.message}
            </div>
          ))}
        </div>

        <form className="input-box" onSubmit={sendChat}>
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Send text"
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
}

export default App;
