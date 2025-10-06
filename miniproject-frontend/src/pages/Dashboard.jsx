import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import "./Dashboard.css"; // <-- import the CSS file

// Initialize Gemini
const genAI = new GoogleGenerativeAI("AIzaSyAoCLWD_jTlF0aTyxPZzgf0jXKU6WMETi0"); // replace with your Gemini API key
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const Dashboard = () => {
  const [messages, setMessages] = useState([
    { role: "system", text: "🌿 I only give plant disease remedies." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", text: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const prompt = `
      You are an agriculture expert.
      The user will describe plant issues or diseases.
      Reply ONLY with remedies (step-by-step, clear, no chit-chat).
      User query: ${input}
      `;

      const result = await model.generateContent(prompt);
      const reply = result.response.text();

      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "⚠️ Error connecting to Gemini." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <div className="chat-card">
        {/* Header */}
        <div className="chat-header">🌿 Plant Disease Remedy Bot</div>

        {/* Chat Window */}
        <div className="chat-window">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`message ${
                msg.role === "user"
                  ? "user"
                  : msg.role === "assistant"
                  ? "assistant"
                  : "system"
              }`}
            >
              {msg.text}
            </div>
          ))}
          {loading && <div className="loading-line">🌱 Thinking...</div>}
        </div>

        {/* Input Area */}
        <div className="input-area">
          <input
            className="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your plant issue..."
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button className="send-btn" onClick={sendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
