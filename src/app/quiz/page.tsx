"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { sections, defaultProfile, type FullProfile, type Question } from "@/lib/quiz-data";

export default function Quiz() {
  const router = useRouter();
  const [sectionIdx, setSectionIdx] = useState(0);
  const [questionIdx, setQuestionIdx] = useState(0);
  const [profile, setProfile] = useState<FullProfile>({ ...defaultProfile });

  const currentSection = sections[sectionIdx];
  const currentQuestion = currentSection.questions[questionIdx];
  const totalQuestions = sections.reduce((sum, s) => sum + s.questions.length, 0);
  const completedQuestions = sections.slice(0, sectionIdx).reduce((sum, s) => sum + s.questions.length, 0) + questionIdx;

  // Get the current value for a question
  const getValue = useCallback((id: string): string | string[] => {
    return profile[id as keyof FullProfile] as string | string[];
  }, [profile]);

  // Set a value in the profile
  const setValue = useCallback((id: string, value: string | string[]) => {
    setProfile(prev => ({ ...prev, [id]: value }));
  }, []);

  // Check if current question has a valid answer
  const hasAnswer = useCallback((q: Question): boolean => {
    const val = getValue(q.id);
    if (q.type === "multi") return Array.isArray(val) && val.length > 0;
    if (q.type === "text" || q.type === "location") return true; // text fields are optional
    return typeof val === "string" && val !== "";
  }, [getValue]);

  // Check if a section is complete
  const isSectionComplete = (idx: number): boolean => {
    return sections[idx].questions.every(q => {
      const val = profile[q.id as keyof FullProfile];
      if (q.type === "multi") return Array.isArray(val) && val.length > 0;
      if (q.type === "text" || q.type === "location") return true;
      return typeof val === "string" && val !== "";
    });
  };

  // Toggle a multi-select value
  const toggleMulti = (id: string, value: string) => {
    const current = (getValue(id) as string[]) || [];
    if (current.includes(value)) {
      setValue(id, current.filter(v => v !== value));
    } else {
      setValue(id, [...current, value]);
    }
  };

  // Navigation
  const goNext = () => {
    if (questionIdx < currentSection.questions.length - 1) {
      setQuestionIdx(questionIdx + 1);
    } else if (sectionIdx < sections.length - 1) {
      setSectionIdx(sectionIdx + 1);
      setQuestionIdx(0);
    } else {
      submit();
    }
  };

  const goBack = () => {
    if (questionIdx > 0) {
      setQuestionIdx(questionIdx - 1);
    } else if (sectionIdx > 0) {
      const prevSection = sections[sectionIdx - 1];
      setSectionIdx(sectionIdx - 1);
      setQuestionIdx(prevSection.questions.length - 1);
    }
  };

  const jumpToSection = (idx: number) => {
    setSectionIdx(idx);
    setQuestionIdx(0);
  };

  const isLastQuestion = sectionIdx === sections.length - 1 && questionIdx === currentSection.questions.length - 1;
  const isFirstQuestion = sectionIdx === 0 && questionIdx === 0;

  const submit = () => {
    // Encode key scoring fields as URL params, store full profile in localStorage
    const params = new URLSearchParams({
      budget: profile.budget,
      interests: profile.interests.join(","),
      style: profile.style,
      risk: profile.riskTolerance,
    });
    // Store full profile for the scoring engine
    localStorage.setItem("lookout-profile", JSON.stringify(profile));
    router.push(`/results?${params.toString()}`);
  };

  // Auto-advance for single-select questions
  const handleSingleSelect = (id: string, value: string) => {
    setValue(id, value);
    // Auto-advance after a short delay for single-select
    setTimeout(() => {
      if (questionIdx < currentSection.questions.length - 1) {
        setQuestionIdx(prev => prev + 1);
      } else if (sectionIdx < sections.length - 1) {
        setSectionIdx(prev => prev + 1);
        setQuestionIdx(0);
      }
    }, 300);
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="hidden md:flex flex-col w-72 border-r border-[var(--border)] bg-[rgba(11,17,32,0.5)] pt-20 px-4 pb-8">
        <div className="text-xs text-teal-400 font-semibold uppercase tracking-wider mb-1 px-3">
          Lookout Fit Score
        </div>
        <div className="text-xs text-slate-500 mb-6 px-3">
          Refine your answers to improve recommendations
        </div>
        <nav className="flex flex-col gap-1">
          {sections.map((s, i) => {
            const isActive = i === sectionIdx;
            const isComplete = isSectionComplete(i);
            return (
              <button
                key={s.id}
                onClick={() => jumpToSection(i)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm transition-all ${
                  isActive
                    ? "bg-teal-500/10 text-white border border-teal-500/30"
                    : isComplete
                    ? "text-slate-300 hover:bg-[var(--card)]"
                    : "text-slate-500 hover:bg-[var(--card)]"
                }`}
              >
                <span className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold ${
                  isActive
                    ? "bg-teal-500 text-[#0b1120]"
                    : isComplete
                    ? "bg-teal-500/20 text-teal-400"
                    : "bg-slate-800 text-slate-500"
                }`}>
                  {isComplete ? "✓" : i + 1}
                </span>
                <span className="flex-1">{s.title}</span>
              </button>
            );
          })}
        </nav>
        <div className="mt-auto pt-6 px-3">
          <div className="text-xs text-slate-600">
            {completedQuestions} of {totalQuestions} questions
          </div>
          <div className="h-1.5 bg-slate-800 rounded-full mt-2">
            <div
              className="h-full bg-teal-500 rounded-full transition-all duration-300"
              style={{ width: `${(completedQuestions / totalQuestions) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-start justify-center px-6 pt-24 pb-20">
        <div className="w-full max-w-xl">
          {/* Mobile section indicator */}
          <div className="md:hidden mb-6">
            <div className="flex gap-1.5 mb-3">
              {sections.map((_, i) => (
                <div key={i} className={`flex-1 h-1 rounded-full ${i <= sectionIdx ? "bg-teal-500" : "bg-slate-800"}`} />
              ))}
            </div>
          </div>

          {/* Section header */}
          <div className="mb-2">
            <div className="text-xs text-teal-400 font-semibold uppercase tracking-wider mb-1">
              {currentSection.icon} {currentSection.title}
            </div>
            <div className="text-xs text-slate-600">
              ~{currentSection.estimatedMinutes} minutes
            </div>
          </div>

          {/* Question */}
          <div className="mt-6">
            <h1 className="text-2xl font-bold mb-2">{currentQuestion.question}</h1>
            {currentQuestion.subtitle && (
              <p className="text-slate-400 text-sm mb-6">{currentQuestion.subtitle}</p>
            )}

            {/* Single select */}
            {currentQuestion.type === "single" && currentQuestion.options && (
              <div className="grid gap-3">
                {currentQuestion.options.map(o => (
                  <button
                    key={o.value}
                    onClick={() => handleSingleSelect(currentQuestion.id, o.value)}
                    className={`text-left px-5 py-4 rounded-xl border transition-all ${
                      getValue(currentQuestion.id) === o.value
                        ? "border-teal-500 bg-teal-500/5 text-white"
                        : "border-[var(--border)] bg-[var(--card)] text-slate-300 hover:border-[var(--border-hover)]"
                    }`}
                  >
                    <div className="font-semibold">{o.label}</div>
                    {o.desc && <div className="text-sm text-slate-400 mt-0.5">{o.desc}</div>}
                  </button>
                ))}
              </div>
            )}

            {/* Multi select */}
            {currentQuestion.type === "multi" && currentQuestion.options && (
              <div className="flex flex-wrap gap-2">
                {currentQuestion.options.map(o => {
                  const selected = ((getValue(currentQuestion.id) as string[]) || []).includes(o.value);
                  return (
                    <button
                      key={o.value}
                      onClick={() => toggleMulti(currentQuestion.id, o.value)}
                      className={`px-4 py-2.5 rounded-full text-sm transition-all ${
                        selected
                          ? "bg-teal-500/10 border border-teal-500 text-teal-400"
                          : "bg-[var(--card)] border border-[var(--border)] text-slate-400 hover:border-[var(--border-hover)]"
                      }`}
                    >
                      {o.label}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Text input */}
            {currentQuestion.type === "text" && (
              <textarea
                value={(getValue(currentQuestion.id) as string) || ""}
                onChange={e => setValue(currentQuestion.id, e.target.value)}
                placeholder={currentQuestion.placeholder}
                rows={4}
                className="w-full px-4 py-3 bg-[var(--card)] border border-[var(--border)] rounded-xl text-white placeholder-slate-500 outline-none focus:border-teal-500 text-sm resize-none"
              />
            )}

            {/* Location input */}
            {currentQuestion.type === "location" && (
              <input
                type="text"
                value={(getValue(currentQuestion.id) as string) || ""}
                onChange={e => setValue(currentQuestion.id, e.target.value)}
                placeholder={currentQuestion.placeholder}
                className="w-full px-4 py-3 bg-[var(--card)] border border-[var(--border)] rounded-xl text-white placeholder-slate-500 outline-none focus:border-teal-500 text-sm"
              />
            )}
          </div>

          {/* Navigation */}
          <div className="flex gap-3 mt-8">
            {!isFirstQuestion && (
              <button
                onClick={goBack}
                className="px-6 py-3 border border-[var(--border)] rounded-xl text-slate-400 hover:text-white transition-colors"
              >
                Back
              </button>
            )}
            {currentQuestion.type === "multi" || currentQuestion.type === "text" || currentQuestion.type === "location" ? (
              <button
                onClick={goNext}
                disabled={currentQuestion.type === "multi" && !hasAnswer(currentQuestion)}
                className="flex-1 py-3 bg-teal-500 hover:bg-teal-600 disabled:opacity-40 disabled:cursor-not-allowed text-[#0b1120] rounded-xl font-bold transition-all"
              >
                {isLastQuestion ? "See My Matches" : "Continue"}
              </button>
            ) : (
              // For single-select, show a skip button for optional questions or when no selection
              !getValue(currentQuestion.id) && (
                <button
                  onClick={goNext}
                  className="flex-1 py-3 border border-[var(--border)] rounded-xl text-slate-400 hover:text-white transition-colors"
                >
                  Skip
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
