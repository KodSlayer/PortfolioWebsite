import React, { useState, useEffect, useRef } from 'react';
import ChatHeader from './ChatHeader';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import SuggestedPrompts from './SuggestedPrompts';
import { sendChatMessage } from '../../services/chatService';
import './Chat.css';

const WELCOME_MESSAGE = {
  role: 'assistant',
  content: `Hi 👋\n\nI'm YASHAAS's AI Assistant!\n\nI can answer questions about his **Experience, Projects, Skills, and Education**.\n\nAsk me anything!`
};

export default function ChatWindow() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const messagesEndRef = useRef(null);

  // Load conversation from sessionStorage on mount
  useEffect(() => {
    const saved = sessionStorage.getItem('portfolio_chat_history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0) {
          setMessages(parsed);
          setHasInteracted(true);
        }
      } catch (e) {
        console.error("Failed to parse chat history");
        setMessages([WELCOME_MESSAGE]);
      }
    } else {
      setMessages([WELCOME_MESSAGE]);
    }
  }, []);

  // Save conversation to sessionStorage on update
  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem('portfolio_chat_history', JSON.stringify(messages));
    }
  }, [messages]);

  // Auto-scroll
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  const handleSend = async (text) => {
    if (!text.trim()) return;

    setHasInteracted(true);

    const newUserMsg = { role: 'user', content: text };
    const updatedMessages = [...messages, newUserMsg];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      // Pass the PREVIOUS messages as history, and the new text as the query
      const historyForApi = messages.map(m => ({ role: m.role, content: m.content }));
      const aiResponseText = await sendChatMessage(historyForApi, text);
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponseText }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `⚠️ **Error:** I'm having trouble connecting to my brain right now. Please try again later.\n\n*(Error details: ${error.message})*`
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-widget-container">
      {/* Floating Action Button Tooltip */}
      {!isOpen && !hasInteracted && (
        <div className="chat-fab-tooltip" onClick={() => setIsOpen(true)}>
          <span>ASK AI ASSISTANT</span>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        className={`chat-fab ${isOpen ? 'chat-fab--open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Chat Assistant"
      >
        <span className="material-symbols-outlined chat-fab__icon">
          {isOpen ? 'close' : 'smart_toy'}
        </span>
      </button>

      {/* Chat Modal */}
      <div className={`chat-window ${isOpen ? 'chat-window--open' : ''}`}>
        <ChatHeader onClose={() => setIsOpen(false)} />

        <div className="chat-window__body hide-scrollbar" data-lenis-prevent="true">
          <div className="chat-messages">
            {messages.map((msg, idx) => (
              <ChatMessage key={idx} role={msg.role} content={msg.content} />
            ))}

            {isLoading && (
              <div className="chat-message chat-message--ai chat-message--typing">
                <div className="chat-message__avatar">
                  <span className="material-symbols-outlined">smart_toy</span>
                </div>
                <div className="chat-message__content">
                  <div className="typing-indicator">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {!hasInteracted && !isLoading && (
            <SuggestedPrompts onSelect={handleSend} />
          )}
        </div>

        <ChatInput onSend={handleSend} isLoading={isLoading} />
      </div>
    </div>
  );
}
