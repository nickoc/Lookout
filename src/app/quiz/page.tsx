"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { categories } from "@/lib/franchises";

const budgetOptions = [
  { value: "50-100", label: "$50K – $100K" },
  { value: "100-200", label: "$100K – $200K" },
  { value: "200-350", label: "$200K – $350K" },
  { value: "350-500", label: "$350K – $500K" },
  { value: "500+", label: "$500K+" },
];

const styleOptions = [
  { value: "owner-operator", label: "Owner-Operator", desc: "You run the business day-to-day" },
  { value: "semi-absentee", label: "Semi-Absentee", desc: "Hire a manager, stay involved part-time" },
  { value: "multi-unit", label: "Multi-Unit", desc: "Scale to multiple locations" },
  { value: "home-based", label: "Home-Based", desc: "Run from home, lower overhead" },
];

const riskOptions = [
  { value: "conservative", label: "Conservative", desc: "Proven brands, lower risk, steady returns" },
  { value: "moderate", label: "Moderate", desc: "Balanced risk and growth potential" },
  { value: "aggressive", label: "Aggressive", desc: "Higher investment, higher upside" },
];

export default function Quiz() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [budget, setBudget] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [style, setStyle] = useState("");
  const [risk, setRisk] = useState("");

  const toggleInterest = (cat: string) => {
    setInterests(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  };

  const submit = () => {
    const params = new URLSearchParams({
      budget,
      interests: interests.join(","),
      style,
      risk,
    });
    router.push(`/results?${params.toString()}`);
  };

  const canNext = () => {
    if (step === 0) return !!budget;
    if (step === 1) return interests.length > 0;
    if (step === 2) return !!style;
    if (step === 3) return !!risk;
    return false;
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-lg">
        {/* Progress */}
        <div className="flex gap-1.5 mb-8">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className={`flex-1 h-1 rounded-full ${i <= step ? "bg-teal-500" : "bg-slate-800"}`} />
          ))}
        </div>
        <div className="text-xs text-slate-500 mb-2">Step {step + 1} of 4</div>

        {/* Step 0: Budget */}
        {step === 0 && (
          <div>
            <h1 className="text-2xl font-bold mb-2">What&apos;s your investment budget?</h1>
            <p className="text-slate-400 text-sm mb-6">Include franchise fee, build-out, and working capital.</p>
            <div className="grid gap-3">
              {budgetOptions.map(o => (
                <button
                  key={o.value}
                  onClick={() => setBudget(o.value)}
                  className={`text-left px-5 py-4 rounded-xl border transition-all ${
                    budget === o.value
                      ? "border-teal-500 bg-teal-500/5 text-white"
                      : "border-[var(--border)] bg-[var(--card)] text-slate-300 hover:border-[var(--border-hover)]"
                  }`}
                >
                  <span className="font-semibold">{o.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 1: Interests */}
        {step === 1 && (
          <div>
            <h1 className="text-2xl font-bold mb-2">What industries interest you?</h1>
            <p className="text-slate-400 text-sm mb-6">Select all that apply. We&apos;ll match you with relevant franchises.</p>
            <div className="flex flex-wrap gap-2">
              {categories.map(c => (
                <button
                  key={c}
                  onClick={() => toggleInterest(c)}
                  className={`px-4 py-2.5 rounded-full text-sm transition-all ${
                    interests.includes(c)
                      ? "bg-teal-500/10 border border-teal-500 text-teal-400"
                      : "bg-[var(--card)] border border-[var(--border)] text-slate-400 hover:border-[var(--border-hover)]"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Style */}
        {step === 2 && (
          <div>
            <h1 className="text-2xl font-bold mb-2">What&apos;s your ownership style?</h1>
            <p className="text-slate-400 text-sm mb-6">This helps us find franchises that fit how you want to work.</p>
            <div className="grid gap-3">
              {styleOptions.map(o => (
                <button
                  key={o.value}
                  onClick={() => setStyle(o.value)}
                  className={`text-left px-5 py-4 rounded-xl border transition-all ${
                    style === o.value
                      ? "border-teal-500 bg-teal-500/5"
                      : "border-[var(--border)] bg-[var(--card)] hover:border-[var(--border-hover)]"
                  }`}
                >
                  <div className="font-semibold text-white">{o.label}</div>
                  <div className="text-sm text-slate-400 mt-0.5">{o.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Risk */}
        {step === 3 && (
          <div>
            <h1 className="text-2xl font-bold mb-2">What&apos;s your risk tolerance?</h1>
            <p className="text-slate-400 text-sm mb-6">We&apos;ll factor this into your match scores.</p>
            <div className="grid gap-3">
              {riskOptions.map(o => (
                <button
                  key={o.value}
                  onClick={() => setRisk(o.value)}
                  className={`text-left px-5 py-4 rounded-xl border transition-all ${
                    risk === o.value
                      ? "border-teal-500 bg-teal-500/5"
                      : "border-[var(--border)] bg-[var(--card)] hover:border-[var(--border-hover)]"
                  }`}
                >
                  <div className="font-semibold text-white">{o.label}</div>
                  <div className="text-sm text-slate-400 mt-0.5">{o.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3 mt-8">
          {step > 0 && (
            <button
              onClick={() => setStep(s => s - 1)}
              className="px-6 py-3 border border-[var(--border)] rounded-xl text-slate-400 hover:text-white transition-colors"
            >
              Back
            </button>
          )}
          {step < 3 ? (
            <button
              onClick={() => canNext() && setStep(s => s + 1)}
              disabled={!canNext()}
              className="flex-1 py-3 bg-teal-500 hover:bg-teal-600 disabled:opacity-40 disabled:cursor-not-allowed text-[#0b1120] rounded-xl font-bold transition-all"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={submit}
              disabled={!canNext()}
              className="flex-1 py-3 bg-teal-500 hover:bg-teal-600 disabled:opacity-40 disabled:cursor-not-allowed text-[#0b1120] rounded-xl font-bold transition-all"
            >
              See My Matches
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
