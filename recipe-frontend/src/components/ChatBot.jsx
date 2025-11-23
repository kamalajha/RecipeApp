import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import "./FloatingChatBot.css";

const socket = io("http://localhost:5050");

function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // Receive bot reply
  useEffect(() => {
    socket.on("bot_reply", (data) => {
      setMessages((prev) => [...prev, data]);
    });
  }, []);

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);

    socket.emit("send_message", userMsg);
    setInput("");
  };

  return (
    <>
      {/* Floating Button */}
      <div className="chat-icon" onClick={() => setOpen(!open)}>💬</div>

      {/* Chat Window */}
      {open && (
        <div className="chat-window">
          <h4>AI Chat Assistant</h4>

          <div className="chat-messages">
            {messages.map((m, i) => (
              <p key={i} className={m.role === "user" ? "user-msg" : "bot-msg"}>
                <b>{m.role}: </b> {m.text}
              </p>
            ))}
          </div>

          <div className="chat-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something..."
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </>
  );
}

export default ChatBot;