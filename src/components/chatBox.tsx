import { useState } from "react";
import { sendMessage } from "../services/api";
import type { Message } from "../types/chat";

const ChatBox = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // 👉 Optional: set this after file upload
  const fileId: string | undefined = undefined;

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now(),
      text: input,
      sender: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await sendMessage(input, fileId);

      const botMessage: Message = {
        id: Date.now() + 1,
        text: res.response, // ✅ FIXED (was res.reply)
        sender: "bot",
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error: any) {
      console.error(error);

      const errorMessage: Message = {
        id: Date.now() + 2,
        text: error?.response?.data?.detail || "Something went wrong",
        sender: "bot",
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Chat</h3>

      <div
        style={{
          border: "1px solid #ccc",
          height: "300px",
          overflowY: "auto",
          padding: "10px",
          marginBottom: "10px",
        }}
      >
        {messages.map((msg) => (
          <div key={msg.id}>
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
      </div>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type message..."
        disabled={loading}
      />

      <button onClick={handleSend} disabled={loading}>
        {loading ? "Thinking..." : "Send"}
      </button>
    </div>
  );
};

export default ChatBox;