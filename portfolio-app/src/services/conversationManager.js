/**
 * Manages the conversation history to prevent context window bloat.
 * Future migration: Can be replaced by a MemorySaver in LangGraph.
 */

// Max exchanges (1 exchange = 1 user message + 1 assistant message)
const MAX_HISTORY_LENGTH = 12; // 6 exchanges

export function getConversation(historyArray) {
  // We assume the component state holds the full array for UI purposes.
  // The manager just trims it down for the LLM payload.
  return trimConversation(historyArray);
}

export function trimConversation(historyArray) {
  if (!historyArray || historyArray.length === 0) return [];
  
  // Exclude the initial welcome message from the LLM payload if it's too long,
  // or keep it but just trim the oldest messages.
  let trimmed = [...historyArray];

  // If the first message is the assistant welcome message, we might want to drop it 
  // from the LLM prompt to save tokens, since it doesn't add context for future answers.
  if (trimmed.length > 0 && trimmed[0].role === 'assistant') {
    trimmed.shift(); 
  }

  // Keep only the last MAX_HISTORY_LENGTH messages
  if (trimmed.length > MAX_HISTORY_LENGTH) {
    trimmed = trimmed.slice(trimmed.length - MAX_HISTORY_LENGTH);
  }

  return trimmed;
}
