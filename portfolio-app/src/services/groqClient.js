/**
 * Handles the actual API request to the backend proxy (which forwards to Groq).
 * Future migration: Can become the LLMNode in LangGraph.
 */

export async function callGroq(messagesPayload) {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Note: we pass messages, and we can also pass the desired parameters 
      // if the proxy allows overriding, otherwise the proxy forces them.
      body: JSON.stringify({ 
        messages: messagesPayload,
        temperature: 0.3,
        max_tokens: 300 
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again in a moment.');
      }
      throw new Error(`Error ${response.status}: Failed to communicate with AI server.`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('GroqClient error:', error);
    throw error;
  }
}
