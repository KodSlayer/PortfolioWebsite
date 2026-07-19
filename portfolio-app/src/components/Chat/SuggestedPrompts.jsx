import React from 'react';

const SUGGESTIONS = [
  "Tell me about Yashaas",
  "Explain his projects",
  "What technologies does he know?",
  "Tell me about his education",
  "Show his certifications",
  "What are his achievements?",
  "What is his AI experience?"
];

export default function SuggestedPrompts({ onSelect }) {
  return (
    <div className="chat-suggestions hide-scrollbar" data-lenis-prevent="true">
      {SUGGESTIONS.map((prompt, index) => (
        <button 
          key={index} 
          className="chat-suggestion-chip"
          onClick={() => onSelect(prompt)}
        >
          {prompt}
        </button>
      ))}
    </div>
  );
}
