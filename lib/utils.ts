import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sanitizeDomain(domain: string): string {
  let cleaned = domain.trim().toLowerCase();
  cleaned = cleaned.replace(/^https?:\/\//, "");
  cleaned = cleaned.replace(/^www\./, "");
  cleaned = cleaned.split('/')[0];
  cleaned = cleaned.split('?')[0];
  return cleaned;
}

export function extractBrandFromDomain(domain: string): string {
  const clean = sanitizeDomain(domain);
  const parts = clean.split('.');
  if (parts.length > 0 && parts[0]) {
    return parts[0];
  }
  return clean;
}
