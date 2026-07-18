import React from 'react';

export default function ChatHeader({ onClose }) {
  return (
    <div className="chat-header">
      <div className="chat-header__info">
        <span className="chat-header__title">Yashaas's AI Assistant here!!</span>
      </div>
      <button className="chat-header__close" onClick={onClose} aria-label="Close Chat">
        <span className="material-symbols-outlined">close</span>
      </button>
    </div>
  );
}
