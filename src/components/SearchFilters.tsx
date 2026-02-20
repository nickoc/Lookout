"use client";

type Props = {
  categories: readonly string[];
  selectedCategory: string;
  investmentRange: string;
  searchQuery: string;
  onCategoryChange: (v: string) => void;
  onInvestmentChange: (v: string) => void;
  onSearchChange: (v: string) => void;
};

export default function SearchFilters({
  categories, selectedCategory, investmentRange, searchQuery,
  onCategoryChange, onInvestmentChange, onSearchChange
}: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <input
        type="text"
        placeholder="Search franchises..."
        value={searchQuery}
        onChange={e => onSearchChange(e.target.value)}
        className="flex-1 px-4 py-3 bg-[var(--card)] border border-[var(--border)] rounded-xl text-white placeholder-slate-500 outline-none focus:border-teal-500 text-sm"
      />
      <select
        value={selectedCategory}
        onChange={e => onCategoryChange(e.target.value)}
        className="px-4 py-3 bg-[var(--card)] border border-[var(--border)] rounded-xl text-white outline-none focus:border-teal-500 text-sm appearance-none cursor-pointer"
      >
        <option value="">All Categories</option>
        {categories.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
      <select
        value={investmentRange}
        onChange={e => onInvestmentChange(e.target.value)}
        className="px-4 py-3 bg-[var(--card)] border border-[var(--border)] rounded-xl text-white outline-none focus:border-teal-500 text-sm appearance-none cursor-pointer"
      >
        <option value="">Any Investment</option>
        <option value="0-100000">Under $100K</option>
        <option value="100000-250000">$100K &ndash; $250K</option>
        <option value="250000-500000">$250K &ndash; $500K</option>
        <option value="500000-99999999">$500K+</option>
      </select>
    </div>
  );
}
