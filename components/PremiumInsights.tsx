import React from "react";
import { Card } from "@/components/ui/Card";
import { ScanQuery, ModelName } from "@/types";
import { Sparkles, Trophy, Target, ShieldAlert, CheckCircle2, TrendingUp } from "lucide-react";

interface PremiumInsightsProps {
  queries: ScanQuery[];
  domain: string;
}

const MODEL_DISPLAY_NAMES: Record<ModelName, string> = {
  gpt: "ChatGPT (GPT-4o mini)",
  claude: "Claude Haiku",
  gemini: "Gemini Flash",
  perplexity: "Perplexity (Sonar)",
};

export const PremiumInsights: React.FC<PremiumInsightsProps> = ({
  queries,
  domain,
}) => {
  // 1. Calculate Competitor Frequency Map
  const competitorMap = new Map<string, number>();

  for (const q of queries) {
    for (const r of q.results || []) {
      if (Array.isArray(r.competitors_mentioned)) {
        for (const comp of r.competitors_mentioned) {
          const trimmed = comp.trim();
          if (trimmed && trimmed.toLowerCase() !== domain.toLowerCase()) {
            // Normalize case while keeping readable display name
            const existingKey = Array.from(competitorMap.keys()).find(
              (k) => k.toLowerCase() === trimmed.toLowerCase()
            );
            const keyToUse = existingKey || trimmed;
            competitorMap.set(keyToUse, (competitorMap.get(keyToUse) || 0) + 1);
          }
        }
      }
    }
  }

  const sortedCompetitors = Array.from(competitorMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  // 2. Calculate Per-Model Mention Rates
  const modelNames: ModelName[] = ["gpt", "claude", "gemini", "perplexity"];
  const modelStats = modelNames.map((name) => {
    let total = 0;
    let mentioned = 0;

    for (const q of queries) {
      const res = (q.results || []).find((r) => r.model_name === name);
      if (res) {
        total++;
        if (res.mentioned) {
          mentioned++;
        }
      }
    }

    const percentage = total > 0 ? Math.round((mentioned / total) * 100) : 0;

    return {
      model_name: name,
      displayName: MODEL_DISPLAY_NAMES[name] || name.toUpperCase(),
      total,
      mentioned,
      percentage,
    };
  });

  // Overall statistics
  let totalMentions = 0;
  let totalExecutions = 0;
  for (const m of modelStats) {
    totalMentions += m.mentioned;
    totalExecutions += m.total;
  }
  const overallMentionRate =
    totalExecutions > 0 ? Math.round((totalMentions / totalExecutions) * 100) : 0;

  // 3. Generate Deterministic Rule-Based Action Plan Bullets
  const actionBullets: string[] = [];

  // Bullet 1: Overall Visibility Rule
  if (overallMentionRate < 50) {
    actionBullets.push(
      `Your domain was mentioned in only ${overallMentionRate}% of buyer search queries. Focus on building authoritative brand mentions and structured product content across key industry sources.`
    );
  } else {
    actionBullets.push(
      `Strong overall visibility across buyer queries (${overallMentionRate}% mention rate). Maintain fresh technical documentation and press releases to retain top AI recommendation spots.`
    );
  }

  // Bullet 2: Top Competitor Rule
  if (sortedCompetitors.length > 0) {
    const topComp = sortedCompetitors[0];
    actionBullets.push(
      `${topComp.name} is your primary AI competitor, appearing ${topComp.count} ${
        topComp.count === 1 ? "time" : "times"
      } in recommendations. Create targeted comparison content ("${domain} vs ${topComp.name}") to capture buyer search intent.`
    );
  } else {
    actionBullets.push(
      `No competing brands were explicitly named in these results. Capitalize on this opportunity to establish early topical authority before competitors index for these search terms.`
    );
  }

  // Bullet 3: Model Gap Rule
  const zeroMentionModels = modelStats.filter((m) => m.mentioned === 0 && m.total > 0);
  const hundredMentionModels = modelStats.filter((m) => m.percentage === 100);

  if (zeroMentionModels.length > 0) {
    const names = zeroMentionModels.map((m) => m.displayName).join(", ");
    actionBullets.push(
      `${names} failed to mention your domain in any query. Ensure schema markup, directory listings, and crawlable citations are optimized for these engines.`
    );
  } else if (hundredMentionModels.length > 0) {
    const names = hundredMentionModels.map((m) => m.displayName).join(", ");
    actionBullets.push(
      `${names} recommended your domain in 100% of tested queries, demonstrating strong topic authority in its retrieval index.`
    );
  }

  // Bullet 4: Competitor Breadth or Parity Rule
  if (sortedCompetitors.length >= 3) {
    actionBullets.push(
      `A total of ${sortedCompetitors.length} distinct competitors were recommended across these queries. Differentiate your brand by publishing explicit feature matrices and clear pricing value propositions.`
    );
  } else {
    actionBullets.push(
      `Cross-engine optimization: AI models pull from distinct indexes. Ensure consistent brand messaging across GitHub, Wikipedia, ProductHunt, and major tech publications.`
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex items-center justify-between border-b border-[#6B7280]/20 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#F5A623]/10 text-[#F5A623] border border-[#F5A623]/20 mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Premium Intelligence
          </div>
          <h3 className="text-2xl font-bold text-[#EDEEF2]">
            Executive Competitive Insights & Action Plan
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Top Competitors Recommended Instead */}
        <Card className="shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#6B7280]/20 pb-3">
            <h4 className="text-lg font-bold flex items-center gap-2 text-[#EDEEF2]">
              <Trophy className="w-5 h-5 text-[#F5A623]" />
              Top Competitors Recommended Instead
            </h4>
          </div>

          {sortedCompetitors.length === 0 ? (
            <p className="text-sm text-[#6B7280] py-6 text-center">
              No competing brands were named in these results
            </p>
          ) : (
            <div className="space-y-2 py-1">
              {sortedCompetitors.map((comp, idx) => (
                <div
                  key={comp.name}
                  className="flex items-center justify-between p-3 rounded-lg bg-[#0E1420]/60 border border-[#6B7280]/20 hover:border-[#F5A623]/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#F5A623]/10 text-[#F5A623] text-xs font-bold flex items-center justify-center border border-[#F5A623]/20">
                      #{idx + 1}
                    </span>
                    <span className="font-semibold text-sm text-[#EDEEF2]">
                      {comp.name}
                    </span>
                  </div>
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#1B2333] text-[#6B7280] border border-[#6B7280]/30">
                    {comp.count} {comp.count === 1 ? "mention" : "mentions"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Card 2: Per-Model Mention Rate */}
        <Card className="shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#6B7280]/20 pb-3">
            <h4 className="text-lg font-bold flex items-center gap-2 text-[#EDEEF2]">
              <TrendingUp className="w-5 h-5 text-[#F5A623]" />
              Per-Model Mention Performance
            </h4>
          </div>

          <div className="space-y-3 py-1">
            {modelStats.map((m) => (
              <div key={m.model_name} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-[#EDEEF2]">{m.displayName}</span>
                  <span className="text-[#F5A623]">
                    {m.mentioned} of {m.total} queries ({m.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-[#0E1420] h-2 rounded-full overflow-hidden border border-[#6B7280]/20">
                  <div
                    className="bg-[#F5A623] h-full rounded-full transition-all duration-500"
                    style={{ width: `${m.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Card 3: Action Plan */}
      <Card className="shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#6B7280]/20 pb-3">
          <h4 className="text-lg font-bold flex items-center gap-2 text-[#EDEEF2]">
            <Target className="w-5 h-5 text-[#F5A623]" />
            Data-Grounded Action Plan
          </h4>
        </div>

        <div className="space-y-3 py-1 text-sm text-[#EDEEF2]">
          {actionBullets.map((bullet, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-[#0E1420]/40 border border-[#6B7280]/20">
              <CheckCircle2 className="w-5 h-5 text-[#F5A623] shrink-0 mt-0.5" />
              <p className="text-sm leading-relaxed text-[#EDEEF2]">{bullet}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
