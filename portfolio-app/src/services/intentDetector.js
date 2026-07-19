/**
 * Lightweight intent detection using regex and keyword matching.
 * Future migration: This can easily become an IntentNode in a LangGraph graph.
 */

const INTENT_RULES = [
  {
    intent: 'greeting',
    pattern: /\b(hi|hello|hey|greetings|morning|afternoon|evening)\b/i,
    weight: 1
  },
  {
    intent: 'profile',
    pattern: /\b(who|about|introduce|yourself|background|profile)\b/i,
    weight: 2
  },
  {
    intent: 'education',
    pattern: /\b(study|college|university|degree|education|school|graduat\w*)\b/i,
    weight: 2
  },
  {
    intent: 'experience',
    pattern: /\b(work\w*|experience|job|role|employ\w*|intern\w*|career)\b/i,
    weight: 2
  },
  {
    intent: 'projects',
    pattern: /\b(project\w*|build\w*|built|made|creat\w*|portfolio|skillsync|note2quiz|sandbox)\b/i,
    weight: 2
  },
  {
    intent: 'skills',
    pattern: /\b(skill\w*|good at|proficient|expert)\b/i,
    weight: 2
  },
  {
    intent: 'technologies',
    pattern: /\b(tech\w*|stack|language\w*|framework\w*|python|react|node|aws|docker|database)\b/i,
    weight: 2
  },
  {
    intent: 'certifications',
    pattern: /\b(cert\w*|badge\w*|passed|exam\w*)\b/i,
    weight: 2
  },
  {
    intent: 'achievements',
    pattern: /\b(achieve\w*|award\w*|won|win)\b/i,
    weight: 2
  },
  {
    intent: 'contact',
    pattern: /\b(contact|reach|email|phone|hire|call)\b/i,
    weight: 2
  },
  {
    intent: 'resume',
    pattern: /\b(resume|cv|download)\b/i,
    weight: 2
  }
];

export function detectIntent(userMessage) {
  const matches = [];

  INTENT_RULES.forEach(rule => {
    if (rule.pattern.test(userMessage)) {
      matches.push({ intent: rule.intent, weight: rule.weight });
    }
  });

  if (matches.length === 0) {
    return {
      primaryIntent: 'general',
      secondaryIntents: [],
      confidence: 0.5
    };
  }

  // Sort by weight descending
  matches.sort((a, b) => b.weight - a.weight);

  const primaryIntent = matches[0].intent;
  const secondaryIntents = matches.slice(1).map(m => m.intent);

  return {
    primaryIntent,
    secondaryIntents,
    confidence: 0.9 // Synthetic confidence for now
  };
}
