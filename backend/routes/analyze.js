const express = require('express');
const axios = require('axios');

const router = express.Router();

const SYSTEM_PROMPT = `You are a fraud detection expert specializing in digital scams targeting users in India via WhatsApp and SMS.

Analyze the message provided and respond ONLY with a single JSON object — no text before or after it, no markdown, no code fences, no explanation outside the JSON.

Use this exact schema:
{
  "verdict": "SCAM" | "LIKELY SCAM" | "LOOKS SAFE",
  "confidence": "high" | "medium" | "low",
  "red_flags": ["flag 1", "flag 2"],
  "explanation": "one sentence plain English summary",
  "what_to_do": ["step 1", "step 2", "step 3"]
}

Verdict rules:
- SCAM: Clear, high-confidence fraud indicators present (fake prizes, OTP/Aadhaar requests, impersonation of banks/government, phishing links, urgency + threat/prize combo).
- LIKELY SCAM: Suspicious patterns but not definitive (odd sender, vague offer, unexpected contact).
- LOOKS SAFE: No significant fraud indicators.

Common Indian scam patterns to detect:
- Fake KYC or Aadhaar update requests
- Lottery or KBC prize claims
- UPI payment fraud ("send Rs. 1 to receive Rs. 10,000")
- Fake job offers requiring a registration fee
- Bank account freeze threats requiring OTP
- Fake delivery or courier notifications with link
- PM Kisan / government subsidy fraud
- Loan app or credit card offers requiring upfront fee
- Romance scams or blackmail

Red flags list should contain short, specific phrases (e.g. "requests OTP or Aadhaar number", "unsolicited prize claim"). Return an empty array if LOOKS SAFE.
What_to_do must always have 2–4 actionable steps appropriate to the verdict.`;

router.post('/', async (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({ error: 'Invalid message' });
  }

  if (message.length > 2000) {
    return res.status(400).json({ error: 'Invalid message' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: 'API key not configured — add GEMINI_API_KEY to .env and restart' });
  }

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${apiKey}`,
      {
        system_instruction: {
          parts: [{ text: SYSTEM_PROMPT }],
        },
        contents: [
          {
            role: 'user',
            parts: [{ text: `Analyze this message for fraud:\n\n${message.trim()}` }],
          },
        ],
        generationConfig: {
          maxOutputTokens: 500,
          temperature: 0.1,
        },
      },
      {
        headers: { 'content-type': 'application/json' },
        timeout: 30000,
      }
    );

    let rawText = response.data.candidates[0].content.parts[0].text.trim();
    console.log('RAW GEMINI RESPONSE:', rawText);

    // Strip markdown code fences
    if (rawText.startsWith('```')) {
      rawText = rawText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
    }

    // Extract JSON object if surrounded by extra text
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (jsonMatch) rawText = jsonMatch[0];

    const analysis = JSON.parse(rawText);
    return res.json(analysis);
  } catch (err) {
    if (err.response) {
      console.error('Gemini API error:', err.response.status, JSON.stringify(err.response.data));
    } else {
      console.error('Request error:', err.message);
    }
    return res.status(502).json({ error: 'Analysis failed' });
  }
});

module.exports = router;
