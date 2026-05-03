import { useState } from "react";
import { sendMessage } from "../services/api";
import type { Message } from "../types/chat";
import FileSelector from "./FileSelector";

const ChatBox = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ store full file object
  const [selectedFile, setSelectedFile] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const messageText = input;

    const userMessage: Message = {
      id: Date.now() + Math.random(),
      text: messageText,
      sender: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await sendMessage(
        messageText,
        selectedFile?.id || undefined
      );

      const botMessage: Message = {
        id: Date.now() + Math.random(),
        text:
          typeof res.response === "string"
            ? res.response
            : JSON.stringify(res.response),
        sender: "bot",
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error: any) {
      console.error(error);

      const errorMessage: Message = {
        id: Date.now() + Math.random(),
        text:
          typeof error?.response?.data?.detail === "string"
            ? error.response.data.detail
            : JSON.stringify(error?.response?.data?.detail) ||
              "Something went wrong",
        sender: "bot",
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* ✅ File Selector */}
      <FileSelector onSelect={setSelectedFile} />

      {/* ✅ Show file name + last 4 digits */}
      {selectedFile && (
        <div style={{ marginTop: "5px" }}>
          <p>
            Selected File:{" "}
            <strong>
              {selectedFile.name} (
              {selectedFile.id.length > 6
                ? selectedFile.id.slice(-6)
                : selectedFile.id}
              )
            </strong>
          </p>

          {/* Optional remove button */}
          <button onClick={() => setSelectedFile(null)}>
            ❌ Remove
          </button>
        </div>
      )}

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
            <strong>{msg.sender}:</strong>{" "}
            {typeof msg.text === "string"
              ? msg.text
              : JSON.stringify(msg.text)}
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