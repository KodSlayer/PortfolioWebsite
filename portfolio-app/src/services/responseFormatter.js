/**
 * Cleans and formats the raw response from the LLM.
 */

export function formatResponse(rawResponseData) {
  if (!rawResponseData || !rawResponseData.choices || rawResponseData.choices.length === 0) {
    throw new Error('Invalid or empty response format from AI server.');
  }

  let content = rawResponseData.choices[0].message?.content || '';

  if (!content.trim()) {
    return "I'm sorry, I couldn't generate a response.";
  }

  // Strip reasoning blocks if using a reasoning model
  content = content.replace(/<think>[\s\S]*?(?:<\/think>|$)/g, '');

  // Trim unnecessary whitespace
  content = content.trim();

  return content;
}
