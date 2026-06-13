import React, { useState, useEffect, useRef } from "react";
import api from "../utils/api";
import { useUser } from "../context/UserContext";
import { Send, MessageCircle, Search } from "lucide-react";

const Messages = () => {
  const { user } = useUser();
  const [contacts, setContacts] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState("conversations"); // conversations | contacts
  const messagesEndRef = useRef(null);

  // Fetch conversations
  useEffect(() => {
    api.get("/messages/conversations")
      .then(res => setConversations(res.data.data || []))
      .catch(() => setConversations([]))
      .finally(() => setLoading(false));
  }, []);

  // Fetch contacts
  useEffect(() => {
    api.get("/messages/contacts")
      .then(res => setContacts(res.data.data || []))
      .catch(() => setContacts([]));
  }, []);

  // Fetch messages when a contact is selected
  useEffect(() => {
    if (!selectedContact) return;
    const fetchMsgs = () => {
      api.get(`/messages/${selectedContact._id}`)
        .then(res => setMessages(res.data.data || []))
        .catch(() => setMessages([]));
    };
    fetchMsgs();
    const interval = setInterval(fetchMsgs, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, [selectedContact]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedContact) return;
    try {
      await api.post("/messages/send", { receiverId: selectedContact._id, content: newMessage });
      setMessages(prev => [...prev, {
        sender: user._id || user.id,
        receiver: selectedContact._id,
        content: newMessage,
        createdAt: new Date().toISOString()
      }]);
      setNewMessage("");
    } catch (err) {
      console.error("Send error:", err);
    }
  };

  const openChat = (contact) => {
    setSelectedContact(contact);
  };

  const filteredContacts = contacts.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Back to list
  if (!selectedContact) {
    return (
      <div className="min-h-screen bg-base-200 p-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <MessageCircle /> Messages
          </h1>

          {/* Tabs */}
          <div className="tabs tabs-boxed mb-4">
            <button className={`tab ${view === "conversations" ? "tab-active" : ""}`} onClick={() => setView("conversations")}>
              Conversations
            </button>
            <button className={`tab ${view === "contacts" ? "tab-active" : ""}`} onClick={() => setView("contacts")}>
              {user?.role === "teacher" ? "Students" : "Teachers"}
            </button>
          </div>

          {view === "contacts" && (
            <label className="input input-bordered flex items-center gap-2 mb-4">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search contacts..."
                className="grow"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </label>
          )}

          {loading ? (
            <div className="flex justify-center py-10">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          ) : view === "conversations" ? (
            <div className="space-y-2">
              {conversations.length === 0 ? (
                <div className="text-center py-10 text-base-content/50">
                  <p>No conversations yet.</p>
                  <p className="text-sm">Go to the contacts tab to start messaging.</p>
                </div>
              ) : (
                conversations.map(conv => (
                  <div
                    key={conv.partner._id}
                    className="card bg-base-100 shadow-sm cursor-pointer hover:shadow-md transition"
                    onClick={() => openChat(conv.partner)}
                  >
                    <div className="card-body p-4 flex-row items-center gap-4">
                      <div className="avatar placeholder">
                        <div className="bg-primary text-primary-content w-10 rounded-full">
                          <span className="text-lg">{conv.partner.name?.charAt(0)}</span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium">{conv.partner.name}</h3>
                        <p className="text-sm text-base-content/50 truncate">{conv.lastMessage?.content || "..."}</p>
                      </div>
                      {conv.unreadCount > 0 && (
                        <span className="badge badge-primary badge-sm">{conv.unreadCount}</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredContacts.length === 0 ? (
                <div className="text-center py-10 text-base-content/50">No contacts found.</div>
              ) : (
                filteredContacts.map(contact => (
                  <div
                    key={contact._id}
                    className="card bg-base-100 shadow-sm cursor-pointer hover:shadow-md transition"
                    onClick={() => openChat(contact)}
                  >
                    <div className="card-body p-4 flex-row items-center gap-4">
                      <div className="avatar placeholder">
                        <div className="bg-secondary text-secondary-content w-10 rounded-full">
                          <span className="text-lg">{contact.name?.charAt(0)}</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{contact.name}</h3>
                        <p className="text-sm text-base-content/50">
                          {contact.role} {contact.classNumber ? `· Class ${contact.classNumber}` : ""}
                        </p>
                      </div>
                      <button className="btn btn-primary btn-sm btn-outline">Chat</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Chat view
  const userId = user?._id || user?.id;
  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
      {/* Chat header */}
      <div className="bg-base-100 shadow-sm p-4 flex items-center gap-4 sticky top-0 z-10">
        <button className="btn btn-ghost btn-sm" onClick={() => setSelectedContact(null)}>← Back</button>
        <div className="avatar placeholder">
          <div className="bg-primary text-primary-content w-8 rounded-full">
            <span>{selectedContact.name?.charAt(0)}</span>
          </div>
        </div>
        <div>
          <h3 className="font-medium">{selectedContact.name}</h3>
          <p className="text-xs text-base-content/50">{selectedContact.role} {selectedContact.classNumber ? `· Class ${selectedContact.classNumber}` : ""}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[calc(100vh-200px)]">
        {messages.length === 0 ? (
          <div className="text-center text-base-content/40 py-10">No messages yet. Say hi! 👋</div>
        ) : (
          messages.map((msg, idx) => {
            const isMine = msg.sender?.toString() === userId?.toString();
            return (
              <div key={idx} className={`chat ${isMine ? "chat-end" : "chat-start"}`}>
                <div className={`chat-bubble ${isMine ? "chat-bubble-primary" : "chat-bubble-secondary"}`}>
                  {msg.content}
                </div>
                <div className="chat-footer text-xs opacity-50">
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-base-100 p-4 border-t">
        <div className="flex gap-2 max-w-2xl mx-auto">
          <input
            type="text"
            className="input input-bordered flex-1"
            placeholder="Type a message..."
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSend()}
          />
          <button className="btn btn-primary" onClick={handleSend} disabled={!newMessage.trim()}>
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Messages;
