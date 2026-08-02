import { callGemini } from '@/lib/llm/gemini';
import { extractBrandFromDomain, sanitizeDomain } from '@/lib/utils';

export async function generateQueries(
  domain: string,
  brandDescription: string,
  customQueries: string[] = []
): Promise<string[]> {
  const cleanDomain = sanitizeDomain(domain);
  const brandName = extractBrandFromDomain(cleanDomain);

  // Clean custom queries provided by the user
  const validCustom = customQueries
    .map((q) => q.trim())
    .filter((q) => q.length > 0);

  // How many queries do we need from Gemini?
  const neededCount = Math.max(0, 5 - validCustom.length);

  if (neededCount === 0) {
    return validCustom.slice(0, 5);
  }

  let generated: string[] = [];

  try {
    const websiteUrl = `https://${cleanDomain}`;
    const prompt = `You are an expert search behavior researcher. Generate ${neededCount} realistic buyer search queries that prospective customers might ask AI search engines when looking for a product like this:
Here is the business's website: ${websiteUrl}
Use its content plus this description to generate realistic buyer queries: "${brandDescription}" (${brandName})

Requirements:
- Provide high-intent buyer queries (e.g. "best [category] software for [use case]", "top tools for [task]", "[category] alternatives").
- Return ONLY a raw JSON array of strings, e.g. ["query 1", "query 2"].
- Do NOT include markdown formatting like \`\`\`json.`;

    const rawResponse = await callGemini(prompt);
    const cleanedText = rawResponse.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanedText);

    if (Array.isArray(parsed)) {
      generated = parsed.map((item) => String(item).trim()).filter((item) => item.length > 0);
    }
  } catch (err) {
    console.warn('[generateQueries] Gemini query generation failed, using fallback templates:', err);
    // Fallback query generator
    generated = [
      `best ${brandDescription.slice(0, 40)} tools`,
      `top software for ${brandDescription.slice(0, 30)}`,
      `what is the best alternative to ${brandName}`,
      `recommended platforms for ${brandDescription.slice(0, 30)}`,
      `how to choose a tool for ${brandDescription.slice(0, 30)}`,
    ];
  }

  // Combine custom + generated and cap at 5 total
  const combined = [...validCustom, ...generated];
  // Deduplicate
  const uniqueQueries = Array.from(new Set(combined));

  // Ensure we always have at least 5 queries
  while (uniqueQueries.length < 5) {
    const index = uniqueQueries.length + 1;
    uniqueQueries.push(`best ${brandDescription.slice(0, 30)} solution ${index}`);
  }

  return uniqueQueries.slice(0, 5);
}
