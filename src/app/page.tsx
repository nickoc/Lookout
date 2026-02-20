"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { franchises, categories } from "@/lib/franchises";
import FranchiseCard from "@/components/FranchiseCard";
import SearchFilters from "@/components/SearchFilters";

export default function Home() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [investment, setInvestment] = useState("");

  const filtered = useMemo(() => {
    return franchises.filter(f => {
      if (search && !f.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (category && f.category !== category) return false;
      if (investment) {
        const [min, max] = investment.split("-").map(Number);
        if (f.investmentMin > max || f.investmentMax < min) return false;
      }
      return true;
    });
  }, [search, category, investment]);

  return (
    <>
      {/* Hero */}
      <section className="pt-20 pb-16 text-center px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight mb-5">
            Find Your Perfect{" "}
            <span className="bg-gradient-to-r from-teal-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Franchise
            </span>
          </h1>
          <p className="text-lg text-slate-400 max-w-xl mx-auto mb-8 leading-relaxed">
            Browse {franchises.length}+ franchise opportunities. Take our 2-minute quiz
            and get personalized match scores powered by AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/quiz"
              className="bg-teal-500 hover:bg-teal-600 text-[#0b1120] px-8 py-3.5 rounded-xl font-bold text-base transition-all hover:-translate-y-0.5 no-underline"
            >
              Take the Quiz — Get Your Fit Scores
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-12 mt-14 flex-wrap">
          {[
            { value: `${franchises.length}+`, label: "Franchises" },
            { value: categories.length.toString(), label: "Categories" },
            { value: "2 min", label: "Quiz Time" },
            { value: "Free", label: "Always" },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className="text-2xl font-extrabold text-teal-400">{s.value}</div>
              <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Browse Section */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <h2 className="text-xl font-bold mb-4">Browse Franchises</h2>
        <SearchFilters
          categories={categories}
          selectedCategory={category}
          investmentRange={investment}
          searchQuery={search}
          onCategoryChange={setCategory}
          onInvestmentChange={setInvestment}
          onSearchChange={setSearch}
        />

        <div className="text-sm text-slate-500 mb-4">
          {filtered.length} franchise{filtered.length !== 1 ? "s" : ""} found
        </div>

        <div className="grid gap-3">
          {filtered.map(f => (
            <FranchiseCard
              key={f.slug}
              slug={f.slug}
              name={f.name}
              category={f.category}
              investmentMin={f.investmentMin}
              investmentMax={f.investmentMax}
              avgRevenue={f.avgRevenue}
              unitCount={f.unitCount}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-500">
            No franchises match your filters. Try broadening your search.
          </div>
        )}
      </section>
    </>
  );
}
