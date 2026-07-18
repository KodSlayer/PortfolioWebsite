import { detectIntent } from './intentDetector';
import { selectContext } from './contextSelector';
import { getConversation } from './conversationManager';
import { buildPrompt } from './promptBuilder';
import { callGroq } from './groqClient';
import { formatResponse } from './responseFormatter';

/**
 * Orchestrator for the Chat Pipeline.
 * Future migration: This is essentially the Graph execution engine.
 * 
 * @param {Array<{role: string, content: string}>} historyArray 
 * @param {string} userQuery
 * @returns {Promise<string>} The assistant's final response text.
 */
export async function sendChatMessage(historyArray, userQuery) {
  try {
    // 1. Intent Detection
    const intents = detectIntent(userQuery);

    // 2. Context Selection
    const selectedContext = selectContext(intents);

    // 3. Conversation Management
    const trimmedConversation = getConversation(historyArray);

    // 4. Prompt Building
    const messagesPayload = buildPrompt(selectedContext, trimmedConversation, userQuery);

    // 5. Groq Client (API Call)
    const rawResponse = await callGroq(messagesPayload);

    // 6. Response Formatting
    const finalResponse = formatResponse(rawResponse);

    return finalResponse;
  } catch (error) {
    console.error('ChatService Orchestrator Error:', error);
    throw error;
  }
}
