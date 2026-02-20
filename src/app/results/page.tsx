"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useMemo, useEffect, useState } from "react";
import { franchises } from "@/lib/franchises";
import { scoreAllFranchises } from "@/lib/scoring";
import { defaultProfile, type FullProfile } from "@/lib/quiz-data";
import FranchiseCard from "@/components/FranchiseCard";
import Link from "next/link";

const dimensionLabels: Record<string, { label: string; icon: string }> = {
  financial: { label: "Financial", icon: "💰" },
  category: { label: "Category", icon: "🎯" },
  style: { label: "Style", icon: "🏢" },
  risk: { label: "Risk", icon: "⚖️" },
  experience: { label: "Experience", icon: "📋" },
  growth: { label: "Growth", icon: "📈" },
};

function ResultsContent() {
  const params = useSearchParams();
  const [profile, setProfile] = useState<FullProfile>({ ...defaultProfile });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Try localStorage first (full profile), fall back to URL params
    const stored = localStorage.getItem("lookout-profile");
    if (stored) {
      try {
        setProfile(JSON.parse(stored));
      } catch {
        // Fall back to URL params
        setProfile({
          ...defaultProfile,
          budget: params.get("budget") || "100-200",
          interests: (params.get("interests") || "").split(",").filter(Boolean),
          style: params.get("style") || "owner-operator",
          riskTolerance: params.get("risk") || "moderate",
        });
      }
    } else {
      setProfile({
        ...defaultProfile,
        budget: params.get("budget") || "100-200",
        interests: (params.get("interests") || "").split(",").filter(Boolean),
        style: params.get("style") || "owner-operator",
        riskTolerance: params.get("risk") || "moderate",
      });
    }
    setLoaded(true);
  }, [params]);

  const scored = useMemo(() => {
    if (!loaded) return [];
    return scoreAllFranchises(profile, franchises);
  }, [profile, loaded]);

  const top = scored.slice(0, 15);

  if (!loaded) {
    return <div className="text-center pt-20 text-slate-500">Calculating your matches...</div>;
  }

  // Build a summary line from the profile
  const budgetLabel = profile.budget ? `$${profile.budget.replace("-", "K–$")}K` : "";
  const styleLabel = profile.style ? profile.style.replace(/-/g, " ") : "";
  const riskLabel = profile.riskTolerance || "moderate";

  return (
    <div className="max-w-3xl mx-auto px-6 pt-12 pb-20">
      <div className="mb-8">
        <div className="text-xs text-teal-400 font-semibold uppercase tracking-wider mb-2">
          Your Results
        </div>
        <h1 className="text-3xl font-extrabold mb-2">Your Top Franchise Matches</h1>
        <p className="text-slate-400">
          {budgetLabel && `Based on your ${budgetLabel} budget`}
          {styleLabel && `, ${styleLabel} style`}
          {riskLabel && `, and ${riskLabel} risk tolerance`}.
          {profile.interests.length > 0 && ` Interested in ${profile.interests.slice(0, 3).join(", ")}${profile.interests.length > 3 ? ` +${profile.interests.length - 3} more` : ""}.`}
        </p>
      </div>

      {/* Top 3 highlight */}
      <div className="grid gap-4 mb-8">
        {top.slice(0, 3).map((f, i) => (
          <Link href={`/franchise/${f.slug}`} key={f.slug} className="block no-underline">
            <div className={`bg-[var(--card)] border rounded-2xl p-6 hover:bg-[var(--card-hover)] transition-all ${
              i === 0 ? "border-teal-500/30" : "border-[var(--border)]"
            }`}>
              <div className="flex items-center gap-4">
                <div className="score-ring" style={{
                  background: f.score >= 90 ? "rgba(20,184,166,0.15)" : f.score >= 80 ? "rgba(59,130,246,0.12)" : "rgba(148,163,184,0.06)",
                  color: f.score >= 90 ? "#14b8a6" : f.score >= 80 ? "#3b82f6" : "#94a3b8",
                }}>
                  {f.score}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{f.name}</span>
                    {i === 0 && (
                      <span className="text-[0.6rem] font-bold uppercase tracking-wider bg-teal-500/10 text-teal-400 px-2 py-0.5 rounded">
                        Best Match
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-slate-400 mt-0.5">{f.category}</div>
                  <div className="flex gap-4 mt-2 text-xs text-slate-500">
                    <span>${Math.round(f.investmentMin / 1000)}K–${Math.round(f.investmentMax / 1000)}K</span>
                    {f.avgRevenue && <span>Avg Rev: ${Math.round(f.avgRevenue / 1000)}K/yr</span>}
                    <span>{f.unitCount.toLocaleString()} units</span>
                  </div>
                </div>
                {/* Score breakdown */}
                <div className="hidden sm:grid grid-cols-6 gap-1.5 text-center">
                  {Object.entries(f.scoreBreakdown).map(([key, val]) => {
                    const dim = dimensionLabels[key];
                    if (!dim) return null;
                    return (
                      <div key={key}>
                        <div className="text-xs font-bold" style={{ color: val >= 80 ? "#14b8a6" : val >= 60 ? "#3b82f6" : "#64748b" }}>
                          {val}
                        </div>
                        <div className="text-[0.5rem] text-slate-600 uppercase">{dim.label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Rest of results */}
      <h2 className="text-lg font-bold mb-3 text-slate-300">More Matches</h2>
      <div className="grid gap-3">
        {top.slice(3).map(f => (
          <FranchiseCard
            key={f.slug}
            slug={f.slug}
            name={f.name}
            category={f.category}
            investmentMin={f.investmentMin}
            investmentMax={f.investmentMax}
            avgRevenue={f.avgRevenue}
            unitCount={f.unitCount}
            score={f.score}
          />
        ))}
      </div>

      <div className="text-center mt-12">
        <Link
          href="/quiz"
          className="text-sm text-slate-400 hover:text-teal-400 transition-colors"
        >
          Retake quiz with different preferences &rarr;
        </Link>
      </div>
    </div>
  );
}

export default function Results() {
  return (
    <Suspense fallback={<div className="text-center pt-20 text-slate-500">Calculating your matches...</div>}>
      <ResultsContent />
    </Suspense>
  );
}
