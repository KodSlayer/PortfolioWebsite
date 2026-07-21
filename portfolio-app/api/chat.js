export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, temperature = 0.3, max_tokens = 300 } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const payload = {
      model: process.env.VITE_LLM_DEPLOYMENT || 'meta-llama/llama-4-scout-17b-16e-instruct',
      messages: messages,
      temperature: temperature,
      max_tokens: max_tokens,
    };

    const endpoint = process.env.VITE_LLM_ENDPOINT || 'https://api.groq.com/openai/v1';

    const response = await fetch(`${endpoint}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.VITE_LLM_API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Groq API Error:', errText);
      return res.status(response.status).json({ error: 'Failed to fetch from AI provider' });
    }

    const data = await response.json();
    return res.status(200).json(data);

  } catch (error) {
    console.error('Serverless Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
