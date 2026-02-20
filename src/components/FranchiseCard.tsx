import Link from "next/link";

type Props = {
  slug: string;
  name: string;
  category: string;
  investmentMin: number;
  investmentMax: number;
  avgRevenue: number | null;
  unitCount: number;
  score?: number;
};

function formatK(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  return `$${Math.round(n / 1000)}K`;
}

export default function FranchiseCard({ slug, name, category, investmentMin, investmentMax, avgRevenue, unitCount, score }: Props) {
  const ringBg = score && score >= 90 ? "rgba(20,184,166,0.12)" : score && score >= 75 ? "rgba(59,130,246,0.12)" : "rgba(148,163,184,0.06)";
  const ringColor = score && score >= 90 ? "#14b8a6" : score && score >= 75 ? "#3b82f6" : "#64748b";

  return (
    <Link href={`/franchise/${slug}`} className="block no-underline">
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 hover:bg-[var(--card-hover)] hover:border-[var(--border-hover)] hover:-translate-y-0.5 transition-all cursor-pointer">
        <div className="flex items-center gap-4">
          {score !== undefined && (
            <div className="score-ring" style={{ background: ringBg, color: ringColor }}>
              {score}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-white text-[0.95rem]">{name}</div>
            <div className="text-slate-400 text-sm mt-0.5">
              {category} &middot; {formatK(investmentMin)}&ndash;{formatK(investmentMax)}
            </div>
            <div className="flex gap-3 mt-2 text-xs text-slate-500">
              {avgRevenue && <span>Avg Rev: {formatK(avgRevenue)}/yr</span>}
              <span>{unitCount.toLocaleString()} units</span>
            </div>
          </div>
          <svg className="w-5 h-5 text-slate-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
