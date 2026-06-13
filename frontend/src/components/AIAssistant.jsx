import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Sparkles, BookOpen, HelpCircle, GraduationCap } from "lucide-react";
import api from "../utils/api";

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi! 👋 I'm your **EduNest Study Assistant**. I can help you with:\n\n• Explaining concepts\n• Homework guidance\n• Exam preparation tips\n• Subject-specific questions\n\nWhat would you like to learn today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [subject, setSubject] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickPrompts = [
    { text: "Explain a concept", icon: <BookOpen size={14} /> },
    { text: "Help with homework", icon: <HelpCircle size={14} /> },
    { text: "Exam preparation tips", icon: <GraduationCap size={14} /> },
  ];

  const sendMessage = async (text) => {
    const messageText = text || input.trim();
    if (!messageText) return;

    setMessages((prev) => [...prev, { role: "user", text: messageText }]);
    setInput("");
    setLoading(true);

    try {
      const res = await api.post("/ai/chat", {
        message: messageText,
        subject: subject || undefined,
      });
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: res.data.data.reply },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Sorry, I'm having trouble connecting. Please try again in a moment. 🔄",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatMessage = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br/>')
      .replace(/• /g, '&bull; ');
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-20 right-4 lg:bottom-6 lg:right-6 z-[100] btn btn-circle btn-lg shadow-2xl"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          border: "none",
          color: "white",
          animation: isOpen ? "none" : "pulse-glow 2s infinite",
        }}
        id="ai-assistant-toggle"
      >
        {isOpen ? <X size={24} /> : <Sparkles size={24} />}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div
          className="fixed bottom-36 right-4 lg:bottom-20 lg:right-6 z-[99] w-[340px] sm:w-[380px] max-h-[70vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden"
          style={{
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
          }}
        >
          {/* Header */}
          <div
            className="px-4 py-3 flex items-center gap-3"
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            }}
          >
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
              <Sparkles size={18} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold text-sm">EduNest AI Assistant</h3>
              <p className="text-white/70 text-xs">Study helper • Homework guide</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="btn btn-ghost btn-circle btn-xs text-white hover:bg-white/20"
            >
              <X size={16} />
            </button>
          </div>

          {/* Subject Selector */}
          <div className="px-3 py-2 border-b border-base-200">
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="select select-bordered select-xs w-full"
            >
              <option value="">📚 All Subjects</option>
              <option value="Mathematics">🔢 Mathematics</option>
              <option value="Science">🔬 Science</option>
              <option value="English">📖 English</option>
              <option value="History">🏛️ History</option>
              <option value="Geography">🌍 Geography</option>
              <option value="Computer Science">💻 Computer Science</option>
              <option value="Physics">⚡ Physics</option>
              <option value="Chemistry">🧪 Chemistry</option>
              <option value="Biology">🧬 Biology</option>
            </select>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 min-h-[200px] max-h-[40vh]">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-primary text-primary-content rounded-br-sm"
                      : "bg-base-200 text-base-content rounded-bl-sm"
                  }`}
                  dangerouslySetInnerHTML={{ __html: formatMessage(msg.text) }}
                />
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-base-200 px-4 py-3 rounded-2xl rounded-bl-sm">
                  <span className="loading loading-dots loading-sm text-primary"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          {messages.length <= 2 && (
            <div className="px-3 py-2 flex flex-wrap gap-1.5 border-t border-base-200">
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => sendMessage(prompt.text)}
                  className="btn btn-xs btn-outline gap-1 rounded-full"
                  disabled={loading}
                >
                  {prompt.icon}
                  {prompt.text}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="px-3 py-2 border-t border-base-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="input input-bordered input-sm flex-1 rounded-full"
                disabled={loading}
                id="ai-assistant-input"
              />
              <button
                type="submit"
                className="btn btn-circle btn-sm btn-primary"
                disabled={loading || !input.trim()}
                id="ai-assistant-send"
              >
                <Send size={14} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Pulse animation */}
      <style>{`
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(102, 126, 234, 0.4); }
          50% { box-shadow: 0 0 0 12px rgba(102, 126, 234, 0); }
        }
      `}</style>
    </>
  );
};

export default AIAssistant;
