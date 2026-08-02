export async function callGemini(prompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your-gemini-key') {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        tools: [
          {
            url_context: {},
          },
        ],
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  const candidate = data.candidates?.[0];
  const urlContextMetadata = candidate?.url_context_metadata || candidate?.urlContextMetadata || candidate?.groundingMetadata || data.url_context_metadata || data.urlContextMetadata;

  if (urlContextMetadata) {
    console.log('[callGemini] URL context metadata retrieved successfully:', urlContextMetadata);
  } else {
    console.log('[callGemini] URL context metadata not present in response');
  }

  const text = candidate?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error('Empty response from Gemini API');
  }

  return text;
}
