// scoring.ts — Lookout Fit Score Engine (v2)
// Computes a 1-100 match score between a FullProfile and a Franchise
// across six weighted dimensions: Financial, Category, Style, Risk, Experience, Growth.

import type { Franchise } from "./franchises";
import type { FullProfile } from "./quiz-data";

// ── Types ──────────────────────────────────────────────────────────────────

/** Backwards-compat alias — consumers can keep importing UserProfile */
export type UserProfile = FullProfile;

export type ScoreBreakdown = {
  financial: number;
  category: number;
  style: number;
  risk: number;
  experience: number;
  growth: number;
};

export type ScoredFranchise = Franchise & {
  score: number;
  scoreBreakdown: ScoreBreakdown;
};

// ── Budget / Range Parsing ─────────────────────────────────────────────────

type Range = { min: number; max: number };

const BUDGET_RANGES: Record<string, Range> = {
  "50-100":  { min: 50_000,  max: 100_000 },
  "100-200": { min: 100_000, max: 200_000 },
  "200-350": { min: 200_000, max: 350_000 },
  "350-500": { min: 350_000, max: 500_000 },
  "500+":    { min: 500_000, max: 2_000_000 },
};

const NET_WORTH_RANGES: Record<string, Range> = {
  "under-250": { min: 0,         max: 250_000 },
  "250-500":   { min: 250_000,   max: 500_000 },
  "500-1m":    { min: 500_000,   max: 1_000_000 },
  "1m-3m":     { min: 1_000_000, max: 3_000_000 },
  "3m+":       { min: 3_000_000, max: 10_000_000 },
};

const LIQUID_CAPITAL_RANGES: Record<string, Range> = {
  "under-50": { min: 0,       max: 50_000 },
  "50-100":   { min: 50_000,  max: 100_000 },
  "100-250":  { min: 100_000, max: 250_000 },
  "250-500":  { min: 250_000, max: 500_000 },
  "500+":     { min: 500_000, max: 2_000_000 },
};

function parseBudget(budget: string): Range {
  return BUDGET_RANGES[budget] ?? { min: 0, max: 2_000_000 };
}

function parseLiquidCapital(lc: string): Range {
  return LIQUID_CAPITAL_RANGES[lc] ?? { min: 0, max: 2_000_000 };
}

function parseNetWorth(nw: string): Range {
  return NET_WORTH_RANGES[nw] ?? { min: 0, max: 10_000_000 };
}

// ── Helpers ────────────────────────────────────────────────────────────────

/** Clamp a number into [lo, hi] */
function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

/** Map a skill-level string to 0-1 */
function skillToScore(level: string): number {
  switch (level) {
    case "advanced":     return 1.0;
    case "intermediate": return 0.66;
    case "beginner":     return 0.33;
    case "none": default: return 0;
  }
}

/** Convert hours-per-week option to a numeric midpoint */
function hoursToNumber(h: string): number {
  switch (h) {
    case "50+":      return 55;
    case "40-50":    return 45;
    case "under-40": return 30;
    default:         return 40; // neutral
  }
}

/** Map credit score option to a 0-1 factor */
function creditScoreFactor(cs: string): number {
  switch (cs) {
    case "750+":      return 1.0;
    case "700-750":   return 0.85;
    case "650-700":   return 0.6;
    case "below-650": return 0.3;
    default:          return 0.7; // "unsure" or empty → slightly below average
  }
}

/** Map management-years option to 0-1 */
function managementScore(my: string): number {
  switch (my) {
    case "10+":  return 1.0;
    case "5-10": return 0.8;
    case "2-5":  return 0.6;
    case "1-2":  return 0.35;
    case "none": return 0.1;
    default:     return 0.5;
  }
}

// ── Financial Fit (25%) ────────────────────────────────────────────────────

function scoreFinancial(profile: FullProfile, franchise: Franchise): number {
  // Budget overlap (primary signal)
  const budget = parseBudget(profile.budget);
  const overlapMin = Math.max(budget.min, franchise.investmentMin);
  const overlapMax = Math.min(budget.max, franchise.investmentMax);

  let budgetScore: number;
  if (overlapMin <= overlapMax) {
    const overlapSize = overlapMax - overlapMin;
    const franchiseRange = franchise.investmentMax - franchise.investmentMin || 1;
    const budgetRange = budget.max - budget.min || 1;
    const coverageRatio = overlapSize / franchiseRange;
    const utilizationRatio = overlapSize / budgetRange;
    budgetScore = Math.min(1, coverageRatio * 0.7 + utilizationRatio * 0.3);
  } else {
    const gap =
      franchise.investmentMin > budget.max
        ? franchise.investmentMin - budget.max
        : budget.min - franchise.investmentMax;
    const midpoint = (budget.min + budget.max) / 2 || 1;
    const gapRatio = gap / midpoint;
    if (gapRatio <= 0.1) budgetScore = 0.60;
    else if (gapRatio <= 0.25) budgetScore = 0.40;
    else if (gapRatio <= 0.5) budgetScore = 0.20;
    else if (gapRatio <= 1.0) budgetScore = 0.08;
    else budgetScore = 0.02;
  }

  // Net worth adequacy — franchise fee should be comfortably within net worth
  let netWorthScore = 0.5; // neutral default
  if (profile.netWorth) {
    const nw = parseNetWorth(profile.netWorth);
    const nwMid = (nw.min + nw.max) / 2;
    const investMid = (franchise.investmentMin + franchise.investmentMax) / 2;
    // Net worth should ideally be 2-3x investment
    const ratio = nwMid / (investMid || 1);
    netWorthScore = clamp(ratio / 3, 0, 1);
  }

  // Liquid capital — should cover franchise fee at minimum
  let liquidScore = 0.5;
  if (profile.liquidCapital) {
    const lc = parseLiquidCapital(profile.liquidCapital);
    const lcMid = (lc.min + lc.max) / 2;
    const fee = franchise.franchiseFee || franchise.investmentMin;
    const ratio = lcMid / (fee || 1);
    liquidScore = clamp(ratio / 2, 0, 1);
  }

  // Credit score factor
  const creditFactor = creditScoreFactor(profile.creditScore);

  // Financing preference bonus: SBA/combination with good credit = slight boost
  let financingBonus = 0;
  if (profile.financingPreference === "sba" && creditFactor >= 0.6) financingBonus = 0.05;
  if (profile.financingPreference === "cash" && budgetScore > 0.7) financingBonus = 0.08;

  const raw =
    budgetScore * 0.45 +
    netWorthScore * 0.2 +
    liquidScore * 0.2 +
    creditFactor * 0.15 +
    financingBonus;

  return Math.round(clamp(raw * 100, 0, 100));
}

// ── Category Fit (20%) ────────────────────────────────────────────────────

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

const MODEL_TAG_MAP: Record<string, string[]> = {
  "brick-and-mortar": ["brick-and-mortar", "storefront", "retail-location"],
  "services": ["service-based", "home-services", "b2b"],
  "mobile": ["mobile", "mobile-services", "food-truck"],
};

function scoreCategory(profile: FullProfile, franchise: Franchise): number {
  if (profile.interests.length === 0 && (!profile.franchiseModel || profile.franchiseModel.length === 0)) {
    return 50; // neutral default
  }

  const fc = franchise.category.toLowerCase().trim();
  const fTags = franchise.tags.map((t) => t.toLowerCase().trim());

  // Industry match
  let industryScore = 50;
  if (profile.interests.length > 0) {
    let matched = false;
    for (const interest of profile.interests) {
      if (interest.toLowerCase().trim() === fc) { industryScore = 100; matched = true; break; }
    }
    if (!matched) {
      let relatedMatch = false;
      for (const interest of profile.interests) {
        const related = RELATED_CATEGORIES[interest] ?? [];
        for (const r of related) {
          if (r.toLowerCase().trim() === fc) { industryScore = 65; relatedMatch = true; break; }
        }
        if (relatedMatch) break;
        const franchiseRelated = RELATED_CATEGORIES[franchise.category] ?? [];
        for (const r of franchiseRelated) {
          if (r.toLowerCase().trim() === interest.toLowerCase().trim()) { industryScore = 65; relatedMatch = true; break; }
        }
        if (relatedMatch) break;
      }
      if (!relatedMatch) industryScore = 10;
    }
  }

  // Franchise model match
  let modelScore = 50;
  if (profile.franchiseModel && profile.franchiseModel.length > 0) {
    let modelMatched = false;
    for (const model of profile.franchiseModel) {
      const desiredTags = MODEL_TAG_MAP[model] ?? [];
      for (const dt of desiredTags) {
        if (fTags.includes(dt)) { modelScore = 100; modelMatched = true; break; }
      }
      if (modelMatched) break;
    }
    if (!modelMatched) modelScore = 30;
  }

  // Weight: 75% industry, 25% model
  return Math.round(industryScore * 0.75 + modelScore * 0.25);
}

// ── Style Fit (15%) ────────────────────────────────────────────────────────

const STYLE_TAG_MAP: Record<string, string[]> = {
  "semi-absentee": ["semi-absentee", "absentee", "manager-run", "passive", "executive-model"],
  "owner-operator": ["owner-operator", "owner-operated", "hands-on", "operator"],
  "multi-unit": ["multi-unit", "area-developer", "area-development", "multi-territory", "scalable"],
  "home-based": ["home-based", "home-office", "mobile", "low-overhead", "no-storefront"],
};

function scoreStyle(profile: FullProfile, franchise: Franchise): number {
  const franchiseTags = franchise.tags.map((t) => t.toLowerCase().trim());

  // Core style match
  const desiredTags = STYLE_TAG_MAP[profile.style] ?? [];
  let styleMatch = 50; // neutral if no style specified
  if (desiredTags.length > 0) {
    const hasDirectMatch = desiredTags.some((d) => franchiseTags.includes(d));
    if (hasDirectMatch) {
      styleMatch = 100;
    } else if (
      profile.style === "semi-absentee" &&
      franchiseTags.some((t) => ["multi-unit", "scalable", "area-developer"].includes(t))
    ) {
      styleMatch = 55;
    } else if (
      profile.style === "multi-unit" &&
      franchiseTags.some((t) => ["semi-absentee", "manager-run", "scalable"].includes(t))
    ) {
      styleMatch = 55;
    } else if (
      profile.style === "home-based" &&
      franchiseTags.some((t) => ["brick-and-mortar", "storefront", "retail-location"].includes(t))
    ) {
      styleMatch = 5;
    } else if (
      profile.style === "semi-absentee" &&
      franchiseTags.some((t) => ["owner-operator", "hands-on", "owner-operated"].includes(t))
    ) {
      styleMatch = 15;
    } else if (
      profile.style === "owner-operator" &&
      franchiseTags.some((t) => ["semi-absentee", "absentee", "passive"].includes(t))
    ) {
      styleMatch = 15;
    } else {
      styleMatch = 30;
    }
  }

  // Day-to-day operations preference
  let dayToDayScore = 50;
  if (profile.dayToDay) {
    if (profile.dayToDay === "myself" && franchiseTags.some((t) => ["owner-operator", "hands-on"].includes(t))) {
      dayToDayScore = 90;
    } else if (profile.dayToDay === "gm-operator" && franchiseTags.some((t) => ["semi-absentee", "manager-run", "passive"].includes(t))) {
      dayToDayScore = 90;
    } else if (profile.dayToDay === "spouse-family") {
      dayToDayScore = 60; // flexible
    } else {
      dayToDayScore = 40;
    }
  }

  // Work location preference
  let locationScore = 50;
  if (profile.workLocation) {
    if (profile.workLocation === "home" && franchiseTags.some((t) => ["home-based", "home-office"].includes(t))) {
      locationScore = 95;
    } else if (profile.workLocation === "home" && franchiseTags.some((t) => ["brick-and-mortar", "storefront"].includes(t))) {
      locationScore = 10;
    } else if (profile.workLocation === "field" && franchiseTags.some((t) => ["mobile", "home-services"].includes(t))) {
      locationScore = 85;
    } else if (profile.workLocation === "office" && franchiseTags.some((t) => ["brick-and-mortar", "storefront", "b2b"].includes(t))) {
      locationScore = 80;
    } else if (profile.workLocation === "open") {
      locationScore = 70;
    } else {
      locationScore = 35;
    }
  }

  // Hours commitment — high hours = better fit for hands-on franchises
  let hoursScore = 50;
  if (profile.hoursYear1) {
    const h1 = hoursToNumber(profile.hoursYear1);
    const isHandsOn = franchiseTags.some((t) => ["owner-operator", "hands-on"].includes(t));
    if (isHandsOn && h1 >= 50) hoursScore = 90;
    else if (isHandsOn && h1 < 40) hoursScore = 30;
    else if (!isHandsOn && h1 < 40) hoursScore = 80;
    else hoursScore = 60;
  }

  // Employee interest
  let employeeScore = 50;
  if (profile.employeeInterest) {
    const hasEmployeeTags = franchiseTags.some((t) => ["brick-and-mortar", "storefront", "food-service"].includes(t));
    if (profile.employeeInterest === "yes" && hasEmployeeTags) employeeScore = 85;
    else if (profile.employeeInterest === "no" && hasEmployeeTags) employeeScore = 25;
    else if (profile.employeeInterest === "indifferent") employeeScore = 60;
    else employeeScore = 50;
  }

  return Math.round(
    styleMatch * 0.35 +
    dayToDayScore * 0.2 +
    locationScore * 0.2 +
    hoursScore * 0.15 +
    employeeScore * 0.1
  );
}

// ── Risk Fit (15%) ─────────────────────────────────────────────────────────

function scoreRisk(profile: FullProfile, franchise: Franchise): number {
  const investmentMid = (franchise.investmentMin + franchise.investmentMax) / 2;
  const investmentRiskScore = clamp(investmentMid / 500_000, 0, 1);
  const provenScore = clamp(franchise.unitCount / 800, 0, 1);
  const revenuePotentialScore = clamp((franchise.avgRevenue || 0) / 1_500_000, 0, 1);
  const currentYear = new Date().getFullYear();
  const age = currentYear - franchise.yearFounded;
  const maturityScore = clamp(age / 30, 0, 1);

  // Core risk tolerance
  let coreRisk: number;
  switch (profile.riskTolerance) {
    case "conservative": {
      const lowInvestment = 1 - investmentRiskScore;
      coreRisk = lowInvestment * 0.35 + provenScore * 0.4 + maturityScore * 0.25;
      break;
    }
    case "moderate": {
      const investmentOk = investmentRiskScore < 0.6 ? 1 - investmentRiskScore * 0.5 : 0.4;
      const trackRecord = provenScore * 0.7 + maturityScore * 0.3;
      coreRisk = investmentOk * 0.3 + trackRecord * 0.35 + revenuePotentialScore * 0.35;
      break;
    }
    case "aggressive": {
      const upside = 1 - provenScore * 0.3;
      coreRisk = revenuePotentialScore * 0.5 + upside * 0.2 + 0.8 * 0.3;
      break;
    }
    default:
      coreRisk = 0.5;
  }

  // Exit strategy alignment
  let exitScore = 0.5;
  if (profile.exitStrategy) {
    if (profile.exitStrategy === "growth-exit" && provenScore < 0.5 && revenuePotentialScore > 0.4) exitScore = 0.8;
    else if (profile.exitStrategy === "long-term" && maturityScore > 0.5 && provenScore > 0.3) exitScore = 0.85;
    else if (profile.exitStrategy === "build-sell" && revenuePotentialScore > 0.3) exitScore = 0.75;
    else if (profile.exitStrategy === "no-strategy") exitScore = 0.5;
    else exitScore = 0.4;
  }

  // Litigation / closed-units tolerance
  let toleranceScore = 0.5;
  if (profile.litigationTolerance === "no" || profile.closedUnitsTolerance === "no") {
    // Penalize franchises with notable closures
    const closureRate = franchise.unitsClosed / (franchise.unitCount || 1);
    if (profile.closedUnitsTolerance === "no" && franchise.unitsClosed > 5) {
      toleranceScore = closureRate > 0.05 ? 0.1 : 0.3;
    } else {
      toleranceScore = 0.7;
    }
  } else if (profile.litigationTolerance === "yes" && profile.closedUnitsTolerance === "yes") {
    toleranceScore = 0.7; // tolerant investors see more options favorably
  }

  // Passive investor preference
  let passiveScore = 0.5;
  if (profile.passiveInvestor === "yes") {
    const franchiseTags = franchise.tags.map((t) => t.toLowerCase());
    passiveScore = franchiseTags.some((t) => ["semi-absentee", "passive", "manager-run", "executive-model"].includes(t)) ? 0.9 : 0.2;
  } else if (profile.passiveInvestor === "no") {
    passiveScore = 0.6; // slight positive for active ownership
  }

  // Timeline alignment — faster timelines favor established systems
  let timelineScore = 0.5;
  if (profile.timelineToOpen) {
    if (profile.timelineToOpen === "within-3" && provenScore > 0.5) timelineScore = 0.8;
    else if (profile.timelineToOpen === "3-6") timelineScore = 0.7;
    else if (profile.timelineToOpen === "6-12") timelineScore = 0.6;
    else if (profile.timelineToOpen === "12+") timelineScore = 0.5;
    else timelineScore = 0.5;
  }

  const raw =
    coreRisk * 0.40 +
    exitScore * 0.15 +
    toleranceScore * 0.15 +
    passiveScore * 0.15 +
    timelineScore * 0.15;

  return Math.round(clamp(raw * 100, 0, 100));
}

// ── Experience Fit (15%) — NEW ─────────────────────────────────────────────

function scoreExperience(profile: FullProfile, franchise: Franchise): number {
  // If no experience fields are filled, return neutral
  const hasExperienceData =
    profile.managementYears || profile.priorOwnership ||
    profile.marketingLevel || profile.operationsLevel ||
    profile.financeLevel || profile.education;
  if (!hasExperienceData) return 50;

  const investmentMid = (franchise.investmentMin + franchise.investmentMax) / 2;
  const isHighInvestment = investmentMid > 300_000;
  const isLargeSystem = franchise.unitCount > 200;
  const franchiseTags = franchise.tags.map((t) => t.toLowerCase());
  const isHandsOn = franchiseTags.some((t) => ["owner-operator", "hands-on"].includes(t));

  // Management experience — more valuable for larger/complex franchises
  const mgmt = managementScore(profile.managementYears);
  let mgmtFit: number;
  if (isHighInvestment || isLargeSystem) {
    mgmtFit = mgmt; // high experience directly correlates
  } else {
    // Smaller franchises: moderate experience is fine
    mgmtFit = mgmt >= 0.35 ? 0.7 + mgmt * 0.3 : 0.5 + mgmt * 0.3;
  }

  // Prior ownership — always a plus, bigger boost for complex operations
  let ownershipFit = 0.5;
  if (profile.priorOwnership === "yes") {
    ownershipFit = isHighInvestment ? 0.95 : 0.8;
  } else if (profile.priorOwnership === "no") {
    // Not a penalty, but established brands with training are better matches
    ownershipFit = isLargeSystem ? 0.55 : 0.45;
  }

  // Skill levels — average of marketing, operations, finance
  const mkt = skillToScore(profile.marketingLevel);
  const ops = skillToScore(profile.operationsLevel);
  const fin = skillToScore(profile.financeLevel);
  const avgSkill = (mkt + ops + fin) / 3;
  // Higher skills → better fit for complex/high-investment franchises
  let skillFit: number;
  if (isHighInvestment) {
    skillFit = 0.3 + avgSkill * 0.7;
  } else {
    skillFit = 0.5 + avgSkill * 0.4; // smaller franchises more forgiving
  }

  // Education — mild signal, stronger for B2B/professional services
  let eduFit = 0.5;
  if (profile.education) {
    const eduScore: Record<string, number> = {
      "post-grad": 1.0,
      "bachelors": 0.75,
      "associates": 0.55,
      "high-school": 0.4,
      "no-degree": 0.3,
    };
    const edu = eduScore[profile.education] ?? 0.5;
    const isProfessional = franchise.category === "B2B Services" || franchise.category === "Education" || franchise.category === "Real Estate";
    eduFit = isProfessional ? 0.3 + edu * 0.7 : 0.4 + edu * 0.3; // less weight for non-professional
  }

  const raw =
    mgmtFit * 0.30 +
    ownershipFit * 0.25 +
    skillFit * 0.30 +
    eduFit * 0.15;

  return Math.round(clamp(raw * 100, 0, 100));
}

// ── Growth Fit (10%) — NEW ─────────────────────────────────────────────────

function scoreGrowth(profile: FullProfile, franchise: Franchise): number {
  // If no growth-related fields are filled, return neutral
  const hasGrowthData =
    profile.unitPreference || profile.leadershipStyle ||
    profile.commitmentLevel || profile.consideringDuration ||
    (profile.hoursYear1 && profile.hoursYear2);
  if (!hasGrowthData) return 50;

  const franchiseTags = franchise.tags.map((t) => t.toLowerCase());
  const isScalable = franchiseTags.some((t) => ["multi-unit", "area-developer", "area-development", "scalable"].includes(t));

  // Unit preference alignment
  let unitFit = 0.5;
  if (profile.unitPreference) {
    if (profile.unitPreference === "multiple" && isScalable) unitFit = 0.95;
    else if (profile.unitPreference === "multiple" && !isScalable) unitFit = 0.3;
    else if (profile.unitPreference === "single" && !isScalable) unitFit = 0.75;
    else if (profile.unitPreference === "single" && isScalable) unitFit = 0.5;
    else if (profile.unitPreference === "both") unitFit = isScalable ? 0.8 : 0.6;
  }

  // Hours trend: decreasing year1→year2 = wants to scale/delegate
  let trendFit = 0.5;
  if (profile.hoursYear1 && profile.hoursYear2) {
    const h1 = hoursToNumber(profile.hoursYear1);
    const h2 = hoursToNumber(profile.hoursYear2);
    const decreasing = h1 > h2;
    const increasing = h2 > h1;
    const same = h1 === h2;

    if (decreasing && isScalable) trendFit = 0.85; // wants to step back + scalable brand
    else if (decreasing && !isScalable) trendFit = 0.5;
    else if (same) trendFit = 0.6;
    else if (increasing) trendFit = 0.4; // planning more hours is unusual
  }

  // Leadership style — transformational/democratic favor growth-oriented brands
  let leadershipFit = 0.5;
  if (profile.leadershipStyle) {
    const growthStyles = ["transformational", "democratic", "servant"];
    const controlStyles = ["autocratic", "transactional"];
    if (growthStyles.includes(profile.leadershipStyle) && isScalable) leadershipFit = 0.8;
    else if (controlStyles.includes(profile.leadershipStyle) && !isScalable) leadershipFit = 0.7;
    else if (profile.leadershipStyle === "laissez-faire" && isScalable) leadershipFit = 0.75;
    else leadershipFit = 0.5;
  }

  // Commitment level — higher commitment = better match for any franchise
  let commitFit = 0.5;
  if (profile.commitmentLevel) {
    const commitMap: Record<string, number> = {
      "ready": 0.95,
      "active": 0.8,
      "interested": 0.55,
      "dream": 0.3,
    };
    commitFit = commitMap[profile.commitmentLevel] ?? 0.5;
  }

  // Duration considering — longer consideration = more serious
  let durationFit = 0.5;
  if (profile.consideringDuration) {
    const durMap: Record<string, number> = {
      "2+": 0.9,
      "1-2": 0.8,
      "6-12": 0.7,
      "under-6": 0.55,
      "just-started": 0.4,
    };
    durationFit = durMap[profile.consideringDuration] ?? 0.5;
  }

  const raw =
    unitFit * 0.30 +
    trendFit * 0.15 +
    leadershipFit * 0.15 +
    commitFit * 0.25 +
    durationFit * 0.15;

  return Math.round(clamp(raw * 100, 0, 100));
}

// ── Main Scoring ───────────────────────────────────────────────────────────

const WEIGHTS = {
  financial:  0.25,
  category:   0.20,
  style:      0.15,
  risk:       0.15,
  experience: 0.15,
  growth:     0.10,
} as const;

export function getScoreBreakdown(profile: FullProfile, franchise: Franchise): ScoreBreakdown {
  return {
    financial:  scoreFinancial(profile, franchise),
    category:   scoreCategory(profile, franchise),
    style:      scoreStyle(profile, franchise),
    risk:       scoreRisk(profile, franchise),
    experience: scoreExperience(profile, franchise),
    growth:     scoreGrowth(profile, franchise),
  };
}

export function scoreAllFranchises(
  profile: FullProfile,
  franchises: Franchise[]
): ScoredFranchise[] {
  return franchises
    .map((franchise) => {
      const scoreBreakdown = getScoreBreakdown(profile, franchise);
      const score = Math.round(
        clamp(
          scoreBreakdown.financial  * WEIGHTS.financial +
          scoreBreakdown.category   * WEIGHTS.category +
          scoreBreakdown.style      * WEIGHTS.style +
          scoreBreakdown.risk       * WEIGHTS.risk +
          scoreBreakdown.experience * WEIGHTS.experience +
          scoreBreakdown.growth     * WEIGHTS.growth,
          1,
          100
        )
      );
      return { ...franchise, score, scoreBreakdown };
    })
    .sort((a, b) => b.score - a.score);
}
