import Link from "next/link";
import Logo from "./Logo";

export default function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[rgba(11,17,32,0.85)] backdrop-blur-xl border-b border-[rgba(148,163,184,0.1)]">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 font-bold text-white no-underline">
          <Logo size={32} />
          <span className="text-lg">Lookout</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/quiz" className="text-sm text-slate-400 hover:text-white transition-colors">
            Find Your Match
          </Link>
          <Link
            href="/quiz"
            className="bg-teal-500 hover:bg-teal-600 text-[#0b1120] px-5 py-2 rounded-lg font-semibold text-sm transition-all hover:-translate-y-0.5"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}
