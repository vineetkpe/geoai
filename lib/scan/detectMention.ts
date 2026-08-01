import { sanitizeDomain, extractBrandFromDomain } from '@/lib/utils';

export function detectMention(
  rawResponse: string,
  domain: string,
  brandDescription?: string
): boolean {
  if (!rawResponse || !domain) return false;

  const textLower = rawResponse.toLowerCase();
  const cleanDomain = sanitizeDomain(domain);
  const brandName = extractBrandFromDomain(cleanDomain);

  // 1. Direct domain match (e.g. acme.com or acme.io)
  if (textLower.includes(cleanDomain)) {
    return true;
  }

  // 2. Direct brand name match (e.g. "Acme")
  if (brandName.length >= 2 && textLower.includes(brandName.toLowerCase())) {
    return true;
  }

  // 3. Extract main brand word from description if available
  if (brandDescription) {
    const descWords = brandDescription
      .split(/\s+/)
      .map((w) => w.replace(/[^a-zA-Z0-9]/g, '').toLowerCase())
      .filter((w) => w.length > 3);

    if (descWords.length > 0 && descWords[0].length >= 3) {
      if (textLower.includes(descWords[0])) {
        return true;
      }
    }
  }

  return false;
}
