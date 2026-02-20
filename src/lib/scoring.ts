// scoring.ts — Lookout Fit Score Engine
// Computes a 1-100 match score between a UserProfile and a Franchise
// across four weighted dimensions: Financial, Category, Style, Risk.

import type { Franchise } from "./franchises";

// ─── Types ──────────────────────────────────────────────────────────────────

export type UserProfile = {
  budget: string; // "50-100" | "100-200" | "200-350" | "350-500" | "500+"
  interests: string[];
  style: string; // "semi-absentee" | "owner-operator" | "multi-unit" | "home-based"
  riskTolerance: string; // "conservative" | "moderate" | "aggressive"
  timeline: string;
};

export type ScoreBreakdown = {
  financial: number;
  category: number;
  style: number;
  risk: number;
};

export type ScoredFranchise = Franchise & {
  score: number;
  scoreBreakdown: ScoreBreakdown;
};

// ─── Budget Parsing ─────────────────────────────────────────────────────────
// Budget ranges in actual dollars (matching franchise data)

type BudgetRange = { min: number; max: number };

const BUDGET_RANGES: Record<string, BudgetRange> = {
  "50-100": { min: 50_000, max: 100_000 },
  "100-200": { min: 100_000, max: 200_000 },
  "200-350": { min: 200_000, max: 350_000 },
  "350-500": { min: 350_000, max: 500_000 },
  "500+": { min: 500_000, max: 2_000_000 },
};

function parseBudget(budget: string): BudgetRange {
  return BUDGET_RANGES[budget] ?? { min: 0, max: 2_000_000 };
}

// ─── Financial Fit (35%) ────────────────────────────────────────────────────

function scoreFinancial(profile: UserProfile, franchise: Franchise): number {
  const budget = parseBudget(profile.budget);

  const overlapMin = Math.max(budget.min, franchise.investmentMin);
  const overlapMax = Math.min(budget.max, franchise.investmentMax);

  if (overlapMin <= overlapMax) {
    const overlapSize = overlapMax - overlapMin;
    const franchiseRange = franchise.investmentMax - franchise.investmentMin || 1;
    const budgetRange = budget.max - budget.min || 1;

    const coverageRatio = overlapSize / franchiseRange;
    const utilizationRatio = overlapSize / budgetRange;

    const rawScore = coverageRatio * 0.7 + utilizationRatio * 0.3;
    return Math.round(Math.min(100, rawScore * 100));
  }

  const gap =
    franchise.investmentMin > budget.max
      ? franchise.investmentMin - budget.max
      : budget.min - franchise.investmentMax;

  const budgetMidpoint = (budget.min + budget.max) / 2;
  const gapRatio = gap / (budgetMidpoint || 1);

  if (gapRatio <= 0.1) return 60;
  if (gapRatio <= 0.25) return 40;
  if (gapRatio <= 0.5) return 20;
  if (gapRatio <= 1.0) return 8;
  return 2;
}

// ─── Category Fit (25%) ─────────────────────────────────────────────────────

const RELATED_CATEGORIES: Record<string, string[]> = {
  "Health & Fitness": ["Personal Care", "Senior Care"],
  "Food & Beverage": ["Retail"],
  "Home Services": ["Cleaning & Maintenance"],
  "B2B Services": ["Real Estate"],
  "Education": ["Pet Services"],
  "Senior Care": ["Health & Fitness", "Home Services"],
  "Automotive": ["Home Services"],
  "Pet Services": ["Education"],
  "Real Estate": ["B2B Services", "Home Services"],
  "Retail": ["Food & Beverage"],
  "Cleaning & Maintenance": ["Home Services"],
  "Personal Care": ["Health & Fitness"],
};

function scoreCategory(profile: UserProfile, franchise: Franchise): number {
  if (profile.interests.length === 0) return 50;

  const fc = franchise.category.toLowerCase().trim();

  for (const interest of profile.interests) {
    if (interest.toLowerCase().trim() === fc) return 100;
  }

  for (const interest of profile.interests) {
    const related = RELATED_CATEGORIES[interest] ?? [];
    for (const r of related) {
      if (r.toLowerCase().trim() === fc) return 65;
    }
    const franchiseRelated = RELATED_CATEGORIES[franchise.category] ?? [];
    for (const r of franchiseRelated) {
      if (r.toLowerCase().trim() === interest.toLowerCase().trim()) return 65;
    }
  }

  return 10;
}

// ─── Style Fit (20%) ────────────────────────────────────────────────────────

const STYLE_TAG_MAP: Record<string, string[]> = {
  "semi-absentee": ["semi-absentee", "absentee", "manager-run", "passive", "executive-model"],
  "owner-operator": ["owner-operator", "owner-operated", "hands-on", "operator"],
  "multi-unit": ["multi-unit", "area-developer", "area-development", "multi-territory", "scalable"],
  "home-based": ["home-based", "home-office", "mobile", "low-overhead", "no-storefront"],
};

function scoreStyle(profile: UserProfile, franchise: Franchise): number {
  const desiredTags = STYLE_TAG_MAP[profile.style] ?? [];
  if (desiredTags.length === 0) return 50;

  const franchiseTags = franchise.tags.map((t) => t.toLowerCase().trim());

  for (const desired of desiredTags) {
    if (franchiseTags.includes(desired)) return 100;
  }

  if (
    profile.style === "semi-absentee" &&
    franchiseTags.some((t) => ["multi-unit", "scalable", "area-developer"].includes(t))
  ) return 55;

  if (
    profile.style === "multi-unit" &&
    franchiseTags.some((t) => ["semi-absentee", "manager-run", "scalable"].includes(t))
  ) return 55;

  if (
    profile.style === "home-based" &&
    franchiseTags.some((t) => ["owner-operator", "owner-operated"].includes(t))
  ) return 40;

  if (
    profile.style === "home-based" &&
    franchiseTags.some((t) => ["brick-and-mortar", "storefront", "retail-location"].includes(t))
  ) return 5;

  if (
    profile.style === "semi-absentee" &&
    franchiseTags.some((t) => ["owner-operator", "hands-on", "owner-operated"].includes(t))
  ) return 15;

  if (
    profile.style === "owner-operator" &&
    franchiseTags.some((t) => ["semi-absentee", "absentee", "passive"].includes(t))
  ) return 15;

  return 30;
}

// ─── Risk Fit (20%) ─────────────────────────────────────────────────────────

function scoreRisk(profile: UserProfile, franchise: Franchise): number {
  const { riskTolerance } = profile;

  const investmentMid = (franchise.investmentMin + franchise.investmentMax) / 2;

  // Normalize to 0-1 (actual dollars: $50K low risk → $500K+ high risk)
  const investmentRiskScore = Math.max(0, Math.min(1, investmentMid / 500_000));
  const provenScore = Math.min(1, franchise.unitCount / 800);
  const revenuePotentialScore = Math.min(1, (franchise.avgRevenue || 0) / 1_500_000);

  const currentYear = new Date().getFullYear();
  const age = currentYear - franchise.yearFounded;
  const maturityScore = Math.min(1, age / 30);

  switch (riskTolerance) {
    case "conservative": {
      const lowInvestment = 1 - investmentRiskScore;
      const raw = lowInvestment * 0.35 + provenScore * 0.4 + maturityScore * 0.25;
      return Math.round(raw * 100);
    }
    case "moderate": {
      const investmentOk = investmentRiskScore < 0.6 ? 1 - investmentRiskScore * 0.5 : 0.4;
      const trackRecord = provenScore * 0.7 + maturityScore * 0.3;
      const raw = investmentOk * 0.3 + trackRecord * 0.35 + revenuePotentialScore * 0.35;
      return Math.round(raw * 100);
    }
    case "aggressive": {
      const upside = 1 - provenScore * 0.3;
      const raw = revenuePotentialScore * 0.5 + upside * 0.2 + 0.8 * 0.3;
      return Math.round(raw * 100);
    }
    default:
      return 50;
  }
}

// ─── Main Scoring ───────────────────────────────────────────────────────────

const WEIGHTS = {
  financial: 0.35,
  category: 0.25,
  style: 0.2,
  risk: 0.2,
} as const;

export function getScoreBreakdown(profile: UserProfile, franchise: Franchise): ScoreBreakdown {
  return {
    financial: scoreFinancial(profile, franchise),
    category: scoreCategory(profile, franchise),
    style: scoreStyle(profile, franchise),
    risk: scoreRisk(profile, franchise),
  };
}

export function scoreAllFranchises(
  profile: UserProfile,
  franchises: Franchise[]
): ScoredFranchise[] {
  return franchises
    .map((franchise) => {
      const scoreBreakdown = getScoreBreakdown(profile, franchise);
      const score = Math.round(
        Math.max(1, Math.min(100,
          scoreBreakdown.financial * WEIGHTS.financial +
          scoreBreakdown.category * WEIGHTS.category +
          scoreBreakdown.style * WEIGHTS.style +
          scoreBreakdown.risk * WEIGHTS.risk
        ))
      );
      return { ...franchise, score, scoreBreakdown };
    })
    .sort((a, b) => b.score - a.score);
}
