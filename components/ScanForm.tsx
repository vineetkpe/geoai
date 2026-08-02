'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { LoadingScan } from "@/components/LoadingScan";

export const ScanForm: React.FC = () => {
  const router = useRouter();
  const [domain, setDomain] = useState("");
  const [description, setDescription] = useState("");
  const [question1, setQuestion1] = useState("");
  const [question2, setQuestion2] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const customQueries = [question1, question2]
      .map((q) => q.trim())
      .filter((q) => q.length > 0);

    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          domain: domain.trim(),
          brand_description: description.trim(),
          custom_queries: customQueries,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong — please try again");
      }

      const scanId = data.scanId || data.id;
      if (scanId) {
        router.push(`/scan/${scanId}`);
      } else {
        throw new Error("Something went wrong — please try again");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong — please try again");
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingScan domain={domain} />;
  }

  return (
    <Card className="w-full max-w-xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium">
            {error}
          </div>
        )}
        <div>
          <label className="block text-xs font-semibold text-[#EDEEF2] uppercase tracking-wider mb-2">
            Website Domain <span className="text-[#F5A623]">*</span>
          </label>
          <Input
            type="text"
            required
            placeholder="yourdomain.com"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-[#EDEEF2] uppercase tracking-wider">
              Short Description <span className="text-[#F5A623]">*</span>
            </label>
            <span className="text-xs font-mono text-[#6B7280]">
              {description.length}/200
            </span>
          </div>
          <textarea
            required
            maxLength={200}
            rows={3}
            placeholder="Describe what your business or product does..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 bg-[#1B2333] border border-[#6B7280]/60 rounded-lg text-[#EDEEF2] placeholder-[#6B7280] focus:outline-none focus:border-[#F5A623] focus:ring-1 focus:ring-[#F5A623] transition-colors text-sm resize-none"
          />
        </div>

        <div className="space-y-3 pt-2 border-t border-[#6B7280]/30">
          <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
            Add a question people might ask AI about your category (optional)
          </label>
          <Input
            type="text"
            placeholder="e.g. What is the best project management tool for small teams?"
            value={question1}
            onChange={(e) => setQuestion1(e.target.value)}
          />
          <Input
            type="text"
            placeholder="e.g. Which software is best for team collaboration?"
            value={question2}
            onChange={(e) => setQuestion2(e.target.value)}
          />
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          Check my visibility
        </Button>
      </form>
    </Card>
  );
};
