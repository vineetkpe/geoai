import { sanitizeDomain, extractBrandFromDomain } from '@/lib/utils';

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function detectMention(
  rawResponse: string,
  domain: string,
  _brandDescription?: string
): boolean {
  if (!rawResponse || !domain) return false;

  const textLower = rawResponse.toLowerCase();
  const cleanDomain = sanitizeDomain(domain);
  if (!cleanDomain) return false;

  // 1. Direct domain match (e.g. acme.com or acme.io)
  if (textLower.includes(cleanDomain)) {
    return true;
  }

  // 2. Brand name extracted from domain
  const brandName = extractBrandFromDomain(cleanDomain).toLowerCase();
  if (!brandName) return false;

  // 2a. For names between 2 and 3 characters, require word boundary match (\bbrand\b)
  if (brandName.length >= 2 && brandName.length < 4) {
    const regex = new RegExp(`\\b${escapeRegex(brandName)}\\b`, 'i');
    if (regex.test(rawResponse)) {
      return true;
    }
  }

  // 2b. For names 4+ characters, allow raw substring match
  if (brandName.length >= 4) {
    if (textLower.includes(brandName)) {
      return true;
    }
  }

  return false;
}
