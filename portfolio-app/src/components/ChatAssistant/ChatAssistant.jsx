import React, { useState, useRef, useEffect } from 'react';
import './ChatAssistant.css';

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hello! I am a simulated AI assistant for Yashaas. How can I help you learn more about his background, projects, or skills?' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const toggleChat = () => setIsOpen(!isOpen);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');

    // Simulate response
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', text: `This is a mock response. The backend LLM integration is currently pending. You asked: "${userMessage}"` }
      ]);
    }, 800);
  };

  return (
    <>
      <button 
        className={`chat-fab ${isOpen ? 'chat-fab--open' : ''}`}
        onClick={toggleChat}
        aria-label="Toggle Chat Assistant"
      >
        <span className="material-symbols-outlined chat-fab__icon">
          {isOpen ? 'close' : 'smart_toy'}
        </span>
      </button>

      {isOpen && (
        <div className="chat-window">
          <div className="chat-window__header">
            <span className="chat-window__title">YASHAAS_AI</span>
            <span className="chat-window__status">
              <span className="chat-window__status-dot" /> ONLINE
            </span>
          </div>

          <div className="chat-window__messages hide-scrollbar">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-message chat-message--${msg.role}`}>
                <div className="chat-message__bubble">
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form className="chat-window__input-area" onSubmit={handleSend}>
            <input
              type="text"
              className="chat-window__input"
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" className="chat-window__send">
              <span className="material-symbols-outlined">send</span>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
