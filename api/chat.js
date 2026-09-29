export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.OPENAI_API_KEY) {
    return response.status(503).json({ error: 'AI service is not configured' });
  }

  try {
    const body = typeof request.body === 'string' ? JSON.parse(request.body) : request.body;
    const messages = Array.isArray(body?.messages) ? body.messages.slice(-12) : [];
    const completion = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: process.env.AANCHAL_AI_MODEL || 'gpt-4.1-mini',
        temperature: 0.3,
        max_tokens: 500,
        messages: [
          {
            role: 'system',
            content: 'You are Aanchal AI, a warm pregnancy and early-parenthood support assistant. Answer ordinary questions directly instead of saying information was not fed. For specific food questions, answer the named food specifically: for example, raw mango is generally okay in pregnancy when washed and eaten in moderation, but unwashed or uncertain pre-cut fruit should be avoided and sour fruit may worsen heartburn. Mention gestational diabetes or other individual dietary restrictions only when relevant. For symptoms such as stomach ache, cramps, nausea, constipation, heartburn, headache, backache, tiredness, or reduced movement, explain common possibilities in plain language, offer low-risk comfort steps, and say when to contact a maternity clinician. Ask at most one useful follow-up question when it would change the guidance, such as how far along the user is, where the pain is, how severe it is, or whether there is bleeding. Never diagnose, prescribe, or replace a clinician. For bleeding, severe or worsening pain, chest pain, trouble breathing, fainting, seizures, vision changes, fluid loss, or reduced fetal movement, tell the user to contact their maternity team or local emergency services immediately. Avoid repeating the same opening or disclaimer in every reply. Do not claim certainty.'
          },
          ...messages.filter(message => ['user', 'assistant'].includes(message?.role) && typeof message.content === 'string').map(message => ({ role: message.role, content: message.content.slice(0, 2000) }))
        ]
      })
    });

    const data = await completion.json();
    if (!completion.ok) {
      return response.status(502).json({ error: data?.error?.message || 'AI request failed' });
    }

    return response.status(200).json({ reply: data.choices?.[0]?.message?.content || '' });
  } catch (error) {
    return response.status(400).json({ error: 'Invalid AI request' });
  }
}
