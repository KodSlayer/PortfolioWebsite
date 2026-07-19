import React from 'react';
import ReactMarkdown from 'react-markdown';

export default function ChatMessage({ role, content }) {
  const isUser = role === 'user';
  
  return (
    <div className={`chat-message chat-message--${isUser ? 'user' : 'ai'}`}>
      {!isUser && (
        <div className="chat-message__avatar">
          <span className="material-symbols-outlined">smart_toy</span>
        </div>
      )}
      <div className="chat-message__content">
        {isUser ? (
          <p>{content}</p>
        ) : (
          <ReactMarkdown
            components={{
              a: ({ node, children, ...props }) => (
                <a {...props} className="chat-link-btn" target="_blank" rel="noopener noreferrer">
                  {children}
                  <span className="material-symbols-outlined" style={{ fontSize: '14px', marginLeft: '4px', verticalAlign: 'middle' }}>open_in_new</span>
                </a>
              )
            }}
          >
            {content}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
}
