import { extractBrandFromDomain, sanitizeDomain } from '@/lib/utils';

export function extractCompetitors(rawResponse: string, ownDomain: string): string[] {
  if (!rawResponse) return [];

  const ownBrand = extractBrandFromDomain(sanitizeDomain(ownDomain)).toLowerCase();
  const competitors = new Set<string>();

  // RegEx heuristic for capitalized multi-word or standalone Brand names (e.g. "Salesforce", "HubSpot", "Zapier", "Notion")
  const brandPattern = /\b([A-Z][a-zA-Z0-9]+(?:\s+[A-Z][a-zA-Z0-9]+)?)\b/g;
  const matches = rawResponse.match(brandPattern) || [];

  const commonStopWords = new Set([
    'The', 'This', 'That', 'These', 'Those', 'Here', 'There', 'What', 'Which', 'Who',
    'Best', 'Top', 'Great', 'Popular', 'Good', 'Key', 'Main', 'Alternative', 'Alternatives',
    'Features', 'Pricing', 'Pros', 'Cons', 'Verdict', 'Overview', 'Summary', 'Rating',
    'Software', 'Platform', 'Tool', 'Solution', 'System', 'Service', 'App', 'Application',
    'Free', 'Paid', 'Enterprise', 'Standard', 'Pro', 'Basic', 'Premium', 'AI', 'LLM',
    'Google', 'OpenAI', 'Anthropic', 'Perplexity', 'ChatGPT', 'Claude', 'Gemini'
  ]);

  for (const match of matches) {
    const cleanMatch = match.trim();
    if (cleanMatch.length < 3) continue;
    if (commonStopWords.has(cleanMatch)) continue;
    if (cleanMatch.toLowerCase().includes(ownBrand)) continue;
    if (ownBrand.includes(cleanMatch.toLowerCase())) continue;

    competitors.add(cleanMatch);
    if (competitors.size >= 8) break;
  }

  return Array.from(competitors);
}
