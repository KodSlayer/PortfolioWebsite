import React, { useState, useRef, useEffect } from 'react';

export default function ChatInput({ onSend, isLoading }) {
  const [input, setInput] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSend(input.trim());
      setInput('');
    }
  };

  return (
    <form className="chat-input-area" onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        type="text"
        className="chat-input"
        placeholder={isLoading ? "Thinking..." : "Ask me anything..."}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={isLoading}
      />
      <button 
        type="submit" 
        className="chat-submit-btn" 
        disabled={!input.trim() || isLoading}
        aria-label="Send Message"
      >
        <span className="material-symbols-outlined">send</span>
      </button>
    </form>
  );
}
