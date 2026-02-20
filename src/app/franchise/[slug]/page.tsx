"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { franchises } from "@/lib/franchises";

function formatK(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  return `$${Math.round(n / 1000)}K`;
}

export default function FranchiseDetail() {
  const { slug } = useParams<{ slug: string }>();
  const franchise = franchises.find((f) => f.slug === slug);

  if (!franchise) {
    return (
      <div className="max-w-3xl mx-auto px-6 pt-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Franchise Not Found</h1>
        <p className="text-slate-400 mb-6">
          We couldn&apos;t find a franchise with that identifier.
        </p>
        <Link href="/" className="text-teal-400 hover:text-teal-300">
          &larr; Back to directory
        </Link>
      </div>
    );
  }

  const growthRate =
    franchise.unitCount > 0
      ? ((franchise.unitsOpened - franchise.unitsClosed) / franchise.unitCount) * 100
      : 0;

  return (
    <div className="max-w-3xl mx-auto px-6 pt-12 pb-20">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <Link href="/" className="hover:text-teal-400 transition-colors">
          Directory
        </Link>
        <span>/</span>
        <span className="text-slate-300">{franchise.name}</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="text-xs text-teal-400 font-semibold uppercase tracking-wider mb-2">
          {franchise.category}
        </div>
        <h1 className="text-3xl font-extrabold mb-3">{franchise.name}</h1>
        <p className="text-slate-400 leading-relaxed">{franchise.description}</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Investment Range",
            value: `${formatK(franchise.investmentMin)}–${formatK(franchise.investmentMax)}`,
          },
          {
            label: "Franchise Fee",
            value: formatK(franchise.franchiseFee),
          },
          {
            label: "Royalty",
            value: `${franchise.royaltyPct}%`,
          },
          {
            label: "Ad Fund",
            value: `${franchise.adFundPct}%`,
          },
        ].map((m) => (
          <div
            key={m.label}
            className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4"
          >
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">
              {m.label}
            </div>
            <div className="text-lg font-bold text-white">{m.value}</div>
          </div>
        ))}
      </div>

      {/* Performance */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 mb-8">
        <h2 className="text-lg font-bold mb-4">Performance Snapshot</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          <div>
            <div className="text-xs text-slate-500 uppercase mb-1">Avg Revenue / Unit</div>
            <div className="text-xl font-bold text-teal-400">
              {franchise.avgRevenue ? `${formatK(franchise.avgRevenue)}/yr` : "N/A"}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500 uppercase mb-1">Total Units</div>
            <div className="text-xl font-bold text-white">
              {franchise.unitCount.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500 uppercase mb-1">Net Growth (1yr)</div>
            <div className={`text-xl font-bold ${growthRate >= 0 ? "text-green-400" : "text-red-400"}`}>
              {growthRate >= 0 ? "+" : ""}{growthRate.toFixed(1)}%
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500 uppercase mb-1">Founded</div>
            <div className="text-xl font-bold text-white">{franchise.yearFounded}</div>
          </div>
        </div>
        <div className="flex gap-6 mt-4 text-sm text-slate-400">
          <span>Units opened: {franchise.unitsOpened}</span>
          <span>Units closed: {franchise.unitsClosed}</span>
          <span>HQ: {franchise.headquarters}</span>
        </div>
      </div>

      {/* Tags */}
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-3">Ownership Styles</h2>
        <div className="flex flex-wrap gap-2">
          {franchise.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1.5 rounded-full text-sm bg-teal-500/10 border border-teal-500/20 text-teal-400"
            >
              {tag.replace(/-/g, " ")}
            </span>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 text-center">
        <h2 className="text-lg font-bold mb-2">Want to see how {franchise.name} matches you?</h2>
        <p className="text-slate-400 text-sm mb-4">
          Take our 2-minute quiz to get a personalized fit score.
        </p>
        <Link
          href="/quiz"
          className="inline-block bg-teal-500 hover:bg-teal-600 text-[#0b1120] px-8 py-3 rounded-xl font-bold transition-all hover:-translate-y-0.5"
        >
          Take the Quiz
        </Link>
      </div>

      {/* External link */}
      {franchise.website && (
        <div className="text-center mt-6">
          <a
            href={franchise.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-slate-400 hover:text-teal-400 transition-colors"
          >
            Visit {franchise.name} official site &rarr;
          </a>
        </div>
      )}
    </div>
  );
}
