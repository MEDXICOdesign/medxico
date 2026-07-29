

const RESOURCE_DESC = {
  full: "full tertiary care (ECMO, Swan-Ganz, all specialists 24h, complete pharmacopeia)",
  intermediate: "intermediate resources (invasive ventilation, vasopressors, basic lab; no ECMO, limited specialists)",
  limited: "very limited/MSF field context (pulse oximeter, basic drugs only; no ICU, no imaging, no specialists on-site)",
};

const LANG_PROMPTS = {
  ES: "neutral Spanish (español neutro, not Argentine voseo)",
  FR: "French",
  EN: "English",
};

function buildPrompt(scenario, resourceLevel, lang) {
  return `You are a clinical expert writing content for Medxico.mx, a multilingual platform for medical residents worldwide.

Generate a structured clinical management approach for the scenario below.
Language: ${LANG_PROMPTS[lang]}
Resource context: ${RESOURCE_DESC[resourceLevel]}
Scenario: ${scenario}

Return ONLY valid JSON, no markdown, no text before or after:
{
  "title": "Clinical approach title in target language (max 7 words)",
  "assessment": "Rapid assessment in target language (2-3 sentences)",
  "steps": [
    "Step 1 in target language, max 20 words",
    "Step 2 in target language, max 20 words",
    "Step 3 in target language, max 20 words",
    "Step 4 in target language, max 20 words",
    "Step 5 in target language, max 20 words"
  ],
  "critical": "One critical warning or clinical pearl in target language (max 25 words)",
  "resourceNote": "What to do if the main resource is unavailable in this context (1 sentence in target language)"
}`;
}

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const { scenario, resourceLevel, lang } = await req.json();

    if (!scenario || !resourceLevel || !lang) {
      return new Response(JSON.stringify({ error: 'Missing parameters' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'API key not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        messages: [{ role: 'user', content: buildPrompt(scenario, resourceLevel, lang) }],
      }),
    });

    const data = await response.json();
    const raw = data.content?.[0]?.text || '';
    const clean = raw.replace(/```json|```/g, '').trim();
    const result = JSON.parse(clean);

    return new Response(JSON.stringify(result), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Generation failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
