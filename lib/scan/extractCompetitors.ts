import { extractBrandFromDomain, sanitizeDomain } from '@/lib/utils';

export function extractCompetitors(rawResponse: string, ownDomain: string): string[] {
  if (!rawResponse || typeof rawResponse !== 'string') return [];

  const ownBrand = extractBrandFromDomain(sanitizeDomain(ownDomain)).toLowerCase();
  const competitorScores = new Map<string, number>();

  const stopWords = new Set([
    'the', 'this', 'that', 'these', 'those', 'here', 'there', 'what', 'which', 'who',
    'best', 'top', 'great', 'popular', 'good', 'key', 'main', 'alternative', 'alternatives',
    'features', 'pricing', 'pros', 'cons', 'verdict', 'overview', 'summary', 'rating',
    'software', 'platform', 'tool', 'tools', 'solution', 'solutions', 'system', 'service',
    'app', 'application', 'free', 'paid', 'enterprise', 'standard', 'pro', 'basic', 'premium',
    'ai', 'llm', 'google', 'openai', 'anthropic', 'perplexity', 'chatgpt', 'claude', 'gemini',
    'conclusion', 'recommendation', 'recommendations', 'summary', 'introduction', 'note',
    'comparison', 'options', 'choices', 'overview', 'final thoughts', 'key takeaway', 'user interface',
    'key features', 'pros & cons', 'use case', 'use cases', 'target audience', 'core features'
  ]);

  // Strategy 1: Extract bolded terms at start of list items or headings (e.g., "**Asana**:", "1. **ClickUp** -", "### Notion")
  const listHeadingPattern = /(?:^|\n)(?:\d+[\.\)]\s*|[\*\-\+]\s*)?(?:\#\#\#?\s*)?\*\*([^\*\:\-\n]+)\*\*/g;
  let match: RegExpExecArray | null;

  while ((match = listHeadingPattern.exec(rawResponse)) !== null) {
    const rawBrand = match[1].trim();
    // Clean up trailing descriptors like " (Free)", ":" etc.
    const cleanBrand = rawBrand.replace(/[\:\-\(\)].*$/, '').trim();
    const lower = cleanBrand.toLowerCase();

    if (
      cleanBrand.length >= 2 &&
      cleanBrand.length <= 35 &&
      !stopWords.has(lower) &&
      !lower.includes(ownBrand) &&
      !ownBrand.includes(lower)
    ) {
      competitorScores.set(cleanBrand, (competitorScores.get(cleanBrand) || 0) + 3);
    }
  }

  // Strategy 2: Extract bolded terms anywhere in response
  const inlineBoldPattern = /\*\*([A-Za-z0-9\s\.\-]{2,30})\*\*/g;
  while ((match = inlineBoldPattern.exec(rawResponse)) !== null) {
    const rawBrand = match[1].trim();
    const cleanBrand = rawBrand.replace(/[\:\-\(\)].*$/, '').trim();
    const lower = cleanBrand.toLowerCase();

    if (
      cleanBrand.length >= 2 &&
      cleanBrand.length <= 35 &&
      !stopWords.has(lower) &&
      !lower.includes(ownBrand) &&
      !ownBrand.includes(lower)
    ) {
      competitorScores.set(cleanBrand, (competitorScores.get(cleanBrand) || 0) + 1);
    }
  }

  // Sort competitors by mention frequency and return top competitors
  const sorted = Array.from(competitorScores.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([name]) => name);

  return sorted.slice(0, 6);
}
