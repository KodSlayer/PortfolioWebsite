import { portfolioContext } from '../data/portfolioContext';

/**
 * Maps the detected intents to the specific sections of the portfolio context.
 * Future migration: This can act as a RetrievalNode fetching from a Vector DB.
 */
export function selectContext(intentData) {
  const { primaryIntent, secondaryIntents } = intentData;
  const allIntents = [primaryIntent, ...secondaryIntents];
  
  // Always include profile for basic grounding unless explicitly unrelated
  const selectedSections = new Set();
  
  if (primaryIntent !== 'unrelated' && primaryIntent !== 'greeting') {
    selectedSections.add(portfolioContext.profile);
  }

  // Map intents to context sections
  allIntents.forEach(intent => {
    if (portfolioContext[intent]) {
      selectedSections.add(portfolioContext[intent]);
    }
  });

  // If general greeting or unrelated, we might only send a tiny instruction
  if (selectedSections.size === 0) {
    return "Yashaas's Portfolio Assistant Context: Ready to answer questions.";
  }

  return Array.from(selectedSections).join('\n\n---\n\n');
}
