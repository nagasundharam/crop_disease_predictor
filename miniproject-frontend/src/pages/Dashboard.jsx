import React, { useState, useRef, useEffect } from "react";
import "./Dashboard.css";

const Dashboard = () => {
  const [messages, setMessages] = useState([
    { role: "system", text: "🌿 Hi! I’m your friendly plant assistant." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [language, setLanguage] = useState("en-US");

  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Speech Recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language;
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = (err) => {
      console.error("Speech recognition error:", err);
      setListening(false);
    };
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setInput(transcript);
      sendMessage(transcript, true); // mark as voice
    };

    recognitionRef.current = recognition;
  }, [language]);

  // --- TTS helper compatible with Chrome & Edge ---
  const speakText = (text, lang = "en-US") => {
    if (!("speechSynthesis" in window)) return;

    // Stop ongoing speech
    window.speechSynthesis.cancel();
    setSpeaking(true);

    const getVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices.length) return null;
      // exact match
      let voice = voices.find((v) => v.lang === lang);
      if (voice) return voice;
      // prefix match
      const prefix = lang.split("-")[0];
      voice = voices.find((v) => v.lang.startsWith(prefix));
      if (voice) return voice;
      // fallback
      return voices[0];
    };

    const speak = () => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      const voice = getVoice();
      if (voice) utterance.voice = voice;
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = (e) => {
        console.error("TTS error:", e);
        setSpeaking(false);
      };
      window.speechSynthesis.speak(utterance);
    };

    // Wait for voices if not loaded
    if (!window.speechSynthesis.getVoices().length) {
      window.speechSynthesis.onvoiceschanged = () => {
        speak();
        window.speechSynthesis.onvoiceschanged = null;
      };
    } else {
      speak();
    }
  };

  const stopSpeech = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    }
  };

  // Send message to backend
  const sendMessage = async (msgText, isVoice = false) => {
    const text = msgText || input;
    if (!text.trim()) return;

    // Stop any ongoing speech before sending
    stopSpeech();

    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, lang: language }),
      });

      if (!response.ok) throw new Error("API error");
      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: data.reply },
      ]);

      // Only read aloud if message came from voice input
      if (isVoice) speakText(data.reply, language);
    } catch (err) {
      console.error(err);
      const errorMsg = "⚠️ Sorry, something went wrong.";
      setMessages((prev) => [...prev, { role: "assistant", text: errorMsg }]);
      if (isVoice) speakText(errorMsg, language);
    } finally {
      setLoading(false);
    }
  };

  // Handle voice input button
  const handleVoiceInput = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return alert("Voice recognition not supported");

    // Stop speech before starting
    stopSpeech();

    if (listening) {
      recognition.stop();
    } else {
      recognition.lang = language;
      recognition.start();
    }
  };

  // Read last assistant message
  const readLastReply = () => {
    const last = [...messages].reverse().find((m) => m.role === "assistant");
    if (!last) return alert("No assistant reply to read");
    speakText(last.text, language);
  };

  return (
    <div className="dashboard">
      <div className="chat-card">
        <div className="chat-header">
          🌿 Plant Assistant Chat
          <select
            className="language-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="en-US">English</option>
            <option value="ta-IN">தமிழ் (Tamil)</option>
            <option value="hi-IN">हिन्दी (Hindi)</option>
            <option value="ml-IN">മലയാളം (Malayalam)</option>
          </select>
        </div>

        <div className="chat-window">
          {messages.map((msg, idx) => (
            <div
              key={idx}
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
          {loading && <div className="typing">🌱 Assistant is typing...</div>}
          <div ref={chatEndRef} />
        </div>

        <div className="input-area">
          <input
            type="text"
            className="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your plant..."
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button className="mic-btn" onClick={handleVoiceInput}>
            {listening ? "🛑 Stop" : "🎤 Speak"}
          </button>
          <button className="send-btn" onClick={() => sendMessage()}>
            Send
          </button>
          <button className="read-btn" onClick={readLastReply}>
            🔊 Read Aloud
          </button>
          <button className="stop-btn" onClick={stopSpeech} disabled={!speaking}>
            ⏹ Stop
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
