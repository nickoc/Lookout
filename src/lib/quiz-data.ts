// quiz-data.ts — Lookout FIT Score question definitions
// Mirrors Franzy's 6-section onboarding with ~40 questions

export type QuestionType = "single" | "multi" | "text" | "location";

export type Option = {
  value: string;
  label: string;
  desc?: string;
};

export type Question = {
  id: string;
  question: string;
  subtitle?: string;
  type: QuestionType;
  options?: Option[];
  placeholder?: string;
};

export type Section = {
  id: string;
  title: string;
  icon: string;
  estimatedMinutes: number;
  questions: Question[];
};

// ─── Full Profile Type ──────────────────────────────────────────────────────

export type FullProfile = {
  // Section 1: Financial Readiness
  budget: string;
  netWorth: string;
  liquidCapital: string;
  creditScore: string;
  financingPreference: string;

  // Section 2: Preferences & Interests
  interests: string[];
  unitPreference: string;
  dayToDay: string;
  workLocation: string;
  franchiseModel: string[];

  // Section 3: Experience & Background
  ageGroup: string;
  education: string;
  currentWork: string;
  managementYears: string;
  employeeInterest: string;
  idealEmployeeCount: string;
  priorOwnership: string;
  marketingLevel: string;
  operationsLevel: string;
  financeLevel: string;

  // Section 4: Ownership Style
  style: string;
  leadershipStyle: string;
  hoursYear1: string;
  hoursYear2: string;

  // Section 5: Risk Profile
  riskTolerance: string;
  exitStrategy: string;
  litigationTolerance: string;
  closedUnitsTolerance: string;
  passiveInvestor: string;
  timelineToOpen: string;
  location: string;

  // Section 6: Mindset & Values
  commitmentLevel: string;
  consideringDuration: string;
  valuesImportance: string;
  coreValues: string[];
  whyFranchise: string;
  biggestConcerns: string;
  goals: string;
};

export const defaultProfile: FullProfile = {
  budget: "", netWorth: "", liquidCapital: "", creditScore: "", financingPreference: "",
  interests: [], unitPreference: "", dayToDay: "", workLocation: "", franchiseModel: [],
  ageGroup: "", education: "", currentWork: "", managementYears: "", employeeInterest: "",
  idealEmployeeCount: "", priorOwnership: "", marketingLevel: "", operationsLevel: "", financeLevel: "",
  style: "", leadershipStyle: "", hoursYear1: "", hoursYear2: "",
  riskTolerance: "", exitStrategy: "", litigationTolerance: "", closedUnitsTolerance: "",
  passiveInvestor: "", timelineToOpen: "", location: "",
  commitmentLevel: "", consideringDuration: "", valuesImportance: "", coreValues: [],
  whyFranchise: "", biggestConcerns: "", goals: "",
};

// ─── Skill Level Options (reused) ───────────────────────────────────────────

const skillLevels: Option[] = [
  { value: "none", label: "None" },
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

// ─── Section Definitions ────────────────────────────────────────────────────

export const sections: Section[] = [
  {
    id: "financial",
    title: "Financial Readiness",
    icon: "💰",
    estimatedMinutes: 2,
    questions: [
      {
        id: "budget",
        question: "What's your investment budget?",
        subtitle: "Include franchise fee, build-out, and working capital.",
        type: "single",
        options: [
          { value: "50-100", label: "$50K – $100K" },
          { value: "100-200", label: "$100K – $200K" },
          { value: "200-350", label: "$200K – $350K" },
          { value: "350-500", label: "$350K – $500K" },
          { value: "500+", label: "$500K+" },
        ],
      },
      {
        id: "netWorth",
        question: "What is your approximate net worth?",
        subtitle: "This helps us match franchises within your financial profile.",
        type: "single",
        options: [
          { value: "under-250", label: "Under $250K" },
          { value: "250-500", label: "$250K – $500K" },
          { value: "500-1m", label: "$500K – $1M" },
          { value: "1m-3m", label: "$1M – $3M" },
          { value: "3m+", label: "$3M+" },
        ],
      },
      {
        id: "liquidCapital",
        question: "How much liquid capital do you have available?",
        subtitle: "Cash or assets you can access within 60 days.",
        type: "single",
        options: [
          { value: "under-50", label: "Under $50K" },
          { value: "50-100", label: "$50K – $100K" },
          { value: "100-250", label: "$100K – $250K" },
          { value: "250-500", label: "$250K – $500K" },
          { value: "500+", label: "$500K+" },
        ],
      },
      {
        id: "creditScore",
        question: "What's your approximate credit score?",
        subtitle: "Important for SBA loan eligibility.",
        type: "single",
        options: [
          { value: "below-650", label: "Below 650" },
          { value: "650-700", label: "650 – 700" },
          { value: "700-750", label: "700 – 750" },
          { value: "750+", label: "750+" },
          { value: "unsure", label: "Not sure" },
        ],
      },
      {
        id: "financingPreference",
        question: "How do you plan to finance your franchise?",
        subtitle: "Select your primary funding approach.",
        type: "single",
        options: [
          { value: "cash", label: "All cash" },
          { value: "sba", label: "SBA loan", desc: "Government-backed small business loan" },
          { value: "401k", label: "401(k) rollover (ROBS)", desc: "Use retirement funds without penalties" },
          { value: "combination", label: "Combination of sources" },
          { value: "unsure", label: "Not sure yet" },
        ],
      },
    ],
  },
  {
    id: "preferences",
    title: "Preferences & Interests",
    icon: "🎯",
    estimatedMinutes: 3,
    questions: [
      {
        id: "unitPreference",
        question: "Are you seeking a single franchise or multiple units?",
        type: "single",
        options: [
          { value: "single", label: "Single Unit Only" },
          { value: "multiple", label: "Multiple Units", desc: "Open to area development deals" },
          { value: "both", label: "Open to Both" },
        ],
      },
      {
        id: "dayToDay",
        question: "Who will run the day-to-day operations?",
        type: "single",
        options: [
          { value: "myself", label: "Myself" },
          { value: "spouse-family", label: "Spouse / Family Member / Partner" },
          { value: "gm-operator", label: "Ideally a GM or Operator" },
        ],
      },
      {
        id: "workLocation",
        question: "Where would you prefer to work?",
        type: "single",
        options: [
          { value: "home", label: "Work from home" },
          { value: "office", label: "Work from an office" },
          { value: "field", label: "Travel / In the field" },
          { value: "open", label: "Open to all of the above" },
        ],
      },
      {
        id: "interests",
        question: "Which industries are you interested in?",
        subtitle: "Select all that apply.",
        type: "multi",
        options: [
          { value: "Automotive", label: "Automotive Services" },
          { value: "B2B Services", label: "Business Services" },
          { value: "Cleaning & Maintenance", label: "Cleaning & Maintenance" },
          { value: "Education", label: "Education" },
          { value: "Food & Beverage", label: "Food & Beverage" },
          { value: "Health & Fitness", label: "Health & Fitness" },
          { value: "Home Services", label: "Home Services" },
          { value: "Personal Care", label: "Personal Care" },
          { value: "Pet Services", label: "Pet Services" },
          { value: "Real Estate", label: "Real Estate" },
          { value: "Retail", label: "Retail" },
          { value: "Senior Care", label: "Senior Care" },
        ],
      },
      {
        id: "franchiseModel",
        question: "Which franchise models interest you?",
        subtitle: "Select all that apply.",
        type: "multi",
        options: [
          { value: "brick-and-mortar", label: "Brick & Mortar", desc: "Retail, restaurant, gym, etc." },
          { value: "services", label: "Service-Based", desc: "Cleaning, consulting, home services, etc." },
          { value: "mobile", label: "Mobile Services", desc: "Food trucks, mobile grooming, etc." },
        ],
      },
    ],
  },
  {
    id: "experience",
    title: "Experience & Background",
    icon: "📋",
    estimatedMinutes: 2,
    questions: [
      {
        id: "ageGroup",
        question: "What is your age group?",
        type: "single",
        options: [
          { value: "18-25", label: "18 to 25" },
          { value: "25-35", label: "25 to 35" },
          { value: "35-40", label: "35 to 40" },
          { value: "40-50", label: "40 to 50" },
          { value: "50-60", label: "50 to 60" },
          { value: "60+", label: "60+" },
        ],
      },
      {
        id: "education",
        question: "What is your educational background?",
        type: "single",
        options: [
          { value: "no-degree", label: "Did not graduate from high school" },
          { value: "high-school", label: "High school diploma" },
          { value: "associates", label: "Associate's degree" },
          { value: "bachelors", label: "Bachelor's degree" },
          { value: "post-grad", label: "Post-graduate degree" },
        ],
      },
      {
        id: "managementYears",
        question: "How many years of management experience do you have?",
        type: "single",
        options: [
          { value: "none", label: "None" },
          { value: "1-2", label: "1 to 2 years" },
          { value: "2-5", label: "2 to 5 years" },
          { value: "5-10", label: "5 to 10 years" },
          { value: "10+", label: "More than 10 years" },
        ],
      },
      {
        id: "priorOwnership",
        question: "Have you owned and operated a business before?",
        type: "single",
        options: [
          { value: "no", label: "No" },
          { value: "yes", label: "Yes" },
        ],
      },
      {
        id: "marketingLevel",
        question: "What level of marketing experience do you have?",
        type: "single",
        options: skillLevels,
      },
      {
        id: "operationsLevel",
        question: "What level of operations experience do you have?",
        type: "single",
        options: skillLevels,
      },
      {
        id: "financeLevel",
        question: "What level of finance/P&L experience do you have?",
        type: "single",
        options: skillLevels,
      },
      {
        id: "employeeInterest",
        question: "Are you interested in a business that employs hourly/front-line employees?",
        type: "single",
        options: [
          { value: "no", label: "No" },
          { value: "indifferent", label: "Indifferent" },
          { value: "yes", label: "Yes" },
        ],
      },
      {
        id: "idealEmployeeCount",
        question: "What is your ideal number of employees at opening?",
        type: "single",
        options: [
          { value: "1-5", label: "1–5" },
          { value: "6-10", label: "6–10" },
          { value: "11-20", label: "11–20" },
          { value: "20+", label: "More than 20" },
        ],
      },
    ],
  },
  {
    id: "ownership",
    title: "Ownership Style",
    icon: "🏢",
    estimatedMinutes: 2,
    questions: [
      {
        id: "style",
        question: "What's your preferred ownership style?",
        subtitle: "This helps us find franchises that fit how you want to work.",
        type: "single",
        options: [
          { value: "owner-operator", label: "Owner-Operator", desc: "You run the business day-to-day" },
          { value: "semi-absentee", label: "Semi-Absentee", desc: "Hire a manager, stay involved part-time" },
          { value: "multi-unit", label: "Multi-Unit", desc: "Scale to multiple locations" },
          { value: "home-based", label: "Home-Based", desc: "Run from home, lower overhead" },
        ],
      },
      {
        id: "leadershipStyle",
        question: "What is your preferred leadership style?",
        type: "single",
        options: [
          { value: "democratic", label: "Democratic" },
          { value: "autocratic", label: "Autocratic" },
          { value: "transformational", label: "Transformational" },
          { value: "transactional", label: "Transactional" },
          { value: "servant", label: "Servant" },
          { value: "laissez-faire", label: "Laissez-faire" },
        ],
      },
      {
        id: "hoursYear1",
        question: "How many hours per week do you expect to work in the first year?",
        type: "single",
        options: [
          { value: "under-40", label: "Less than 40 hours per week" },
          { value: "40-50", label: "40 to 50 hours per week" },
          { value: "50+", label: "More than 50 hours per week" },
        ],
      },
      {
        id: "hoursYear2",
        question: "How many hours per week in the second year?",
        type: "single",
        options: [
          { value: "under-40", label: "Less than 40 hours per week" },
          { value: "40-50", label: "40 to 50 hours per week" },
          { value: "50+", label: "More than 50 hours per week" },
        ],
      },
    ],
  },
  {
    id: "risk",
    title: "Risk Profile",
    icon: "⚖️",
    estimatedMinutes: 2,
    questions: [
      {
        id: "riskTolerance",
        question: "What's your risk tolerance?",
        subtitle: "We'll factor this into your match scores.",
        type: "single",
        options: [
          { value: "conservative", label: "Conservative", desc: "Proven brands, lower risk, steady returns" },
          { value: "moderate", label: "Moderate", desc: "Balanced risk and growth potential" },
          { value: "aggressive", label: "Aggressive", desc: "Higher investment, higher upside" },
        ],
      },
      {
        id: "passiveInvestor",
        question: "Do you have capital and want exposure to franchising without running the business day-to-day?",
        subtitle: "i.e. you have at least $150,000 to invest but don't want to run the day-to-day.",
        type: "single",
        options: [
          { value: "no", label: "No" },
          { value: "yes", label: "Yes" },
        ],
      },
      {
        id: "exitStrategy",
        question: "What is your ideal exit strategy for a franchise business?",
        type: "single",
        options: [
          { value: "growth-exit", label: "Quick growth and exit within 5 years" },
          { value: "long-term", label: "Long-term ownership and cash flow" },
          { value: "build-sell", label: "Build up and sell at premium" },
          { value: "no-strategy", label: "No specific exit strategy in mind" },
        ],
      },
      {
        id: "timelineToOpen",
        question: "How long after being awarded a franchise would you like to open?",
        type: "single",
        options: [
          { value: "within-3", label: "Within 3 months" },
          { value: "3-6", label: "3 to 6 months" },
          { value: "6-12", label: "6 to 12 months" },
          { value: "12+", label: "More than 12 months" },
        ],
      },
      {
        id: "closedUnitsTolerance",
        question: "Would you still want to be connected with a brand that has had more than 5 closed units in the last 2 years?",
        type: "single",
        options: [
          { value: "no", label: "No" },
          { value: "yes", label: "Yes" },
        ],
      },
      {
        id: "litigationTolerance",
        question: "Would you still want to be connected with a brand that has past or ongoing litigation?",
        type: "single",
        options: [
          { value: "no", label: "No" },
          { value: "yes", label: "Yes" },
        ],
      },
      {
        id: "location",
        question: "Where would you like to open your first franchise?",
        subtitle: "City or zip code.",
        type: "location",
        placeholder: "e.g. Pacific Grove, CA 93950",
      },
    ],
  },
  {
    id: "mindset",
    title: "Mindset & Values",
    icon: "🧠",
    estimatedMinutes: 2,
    questions: [
      {
        id: "commitmentLevel",
        question: "How would you rank your interest in becoming a business owner?",
        type: "single",
        options: [
          { value: "dream", label: "It's a dream but probably won't happen" },
          { value: "interested", label: "I'm interested but not fully committed yet" },
          { value: "active", label: "I'm close, actively looking for the right opportunity" },
          { value: "ready", label: "I quit my job and I'm 100% ready" },
        ],
      },
      {
        id: "consideringDuration",
        question: "How long have you been considering franchising?",
        type: "single",
        options: [
          { value: "just-started", label: "Just started" },
          { value: "under-6", label: "Less than 6 months" },
          { value: "6-12", label: "6 to 12 months" },
          { value: "1-2", label: "1 to 2 years" },
          { value: "2+", label: "More than 2 years" },
        ],
      },
      {
        id: "valuesImportance",
        question: "How important is it that your personal values align with the franchise brand's values?",
        type: "single",
        options: [
          { value: "not-important", label: "Not Important" },
          { value: "somewhat", label: "Somewhat Important" },
          { value: "very", label: "Very Important" },
        ],
      },
      {
        id: "coreValues",
        question: "What are your core personal values?",
        subtitle: "Select all that apply.",
        type: "multi",
        options: [
          { value: "integrity", label: "Integrity" },
          { value: "innovation", label: "Innovation" },
          { value: "community", label: "Community focus" },
          { value: "environmental", label: "Environmental responsibility" },
          { value: "customer-service", label: "Customer service excellence" },
          { value: "diversity", label: "Diversity and inclusion" },
        ],
      },
      {
        id: "whyFranchise",
        question: "Why do you prefer a franchise business vs. an independent business?",
        type: "text",
        placeholder: "Tell us in your own words...",
      },
      {
        id: "biggestConcerns",
        question: "What are your biggest concerns or risks you want to avoid?",
        type: "text",
        placeholder: "What worries you most about franchise ownership?",
      },
      {
        id: "goals",
        question: "What are your goals?",
        type: "text",
        placeholder: "What do you want to achieve through franchise ownership?",
      },
    ],
  },
];
