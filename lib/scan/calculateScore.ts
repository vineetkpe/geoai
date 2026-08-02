import { ModelResult } from '@/types';

export function calculateScore(queryResults: ModelResult[][]): number {
  if (!queryResults || queryResults.length === 0) return 0;

  let totalCombos = 0;
  let mentionCount = 0;

  for (const modelGroup of queryResults) {
    for (const res of modelGroup) {
      if (res.status === 'success') {
        totalCombos++;
        if (res.mentioned) {
          mentionCount++;
        }
      }
    }
  }

  if (totalCombos === 0) return 0;

  const score = (mentionCount / totalCombos) * 100;
  return Math.round(score);
}
