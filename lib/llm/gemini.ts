import { GoogleGenAI } from '@google/genai';

export async function callGemini(prompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your-gemini-key') {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const ai = new GoogleGenAI({ apiKey });

  const response = await ai.models.generateContent({
    model: 'gemini-3.1-flash-lite',
    contents: prompt,
    config: {
      tools: [{ urlContext: {} }],
    },
  });

  const candidate = response.candidates?.[0];
  const urlContextMetadata =
    (candidate as any)?.url_context_metadata ||
    (candidate as any)?.urlContextMetadata ||
    (candidate as any)?.groundingMetadata;

  if (urlContextMetadata) {
    console.log('[callGemini] URL context metadata retrieved successfully:', urlContextMetadata);
  } else {
    console.log('[callGemini] URL context metadata not present in response');
  }

  const text = response.text;
  if (!text) {
    throw new Error('Empty response from Gemini API');
  }

  return text;
}
