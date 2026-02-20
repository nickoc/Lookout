# Local-First AI Agent System for Franchise Discovery

## A First-Principles Alternative to Franzy's Centralized Model

**Thesis:** The future of AI for high-stakes personal decisions is *local data, remote capability*. An agent system where your financial profile, goals, and preferences never leave your laptop — while agents go out into the world, gather intelligence, and bring it back to you — is not just more private. It's fundamentally more powerful.

---

## Part 1: First-Principles Decomposition

### What IS Franchise Discovery?

Strip away Franzy's UI, strip away the matchmaking algorithms, strip away the branding. At its most fundamental, a person searching for a franchise is trying to answer **five questions**:

1. **"What's out there?"** — Discovery of the franchise universe (what options exist)
2. **"What fits me?"** — Matching personal attributes to franchise characteristics
3. **"Is this real?"** — Due diligence on specific franchises (FDD analysis, unit economics, litigation)
4. **"Can I afford it?"** — Financial feasibility given personal capital and financing options
5. **"How do I proceed?"** — Connection to the franchisor and transaction execution

These five questions are **irreducible**. Every franchise discovery platform — Franzy, Franchise Direct, FranNet, a franchise broker — is an answer to some subset of these five questions.

### The Data Asymmetry Insight

Here's the critical first-principles observation that Franzy's model obscures:

**Questions 1, 3, and 5 require ZERO user data.** The franchise universe, FDD documents, and franchisor contact information are all public. An agent can answer these questions by going OUT and fetching information — without knowing anything about the user.

**Questions 2 and 4 require user data — but it never needs to leave the room.** Matching and affordability are LOCAL COMPUTATIONS. You take public franchise data, bring it to the user's machine, and compute the match there. The franchise data moves. The user data stays.

Franzy's model inverts this: the user's data moves to Franzy's servers, where it's matched against franchise data that's ALSO on Franzy's servers. This is architecturally convenient for Franzy (they control both sides), but it's not architecturally necessary. It's a business model choice, not a technical requirement.

### What Actually Needs to Move?

| Data Type | Direction | Example |
|-----------|-----------|---------|
| Franchise listings | Public → Local | "List all home service franchises under $100K" |
| FDD documents | Public → Local | Franchise Disclosure Documents (public filings) |
| Unit economics | Public → Local | Average gross revenue, failure rates |
| Franchisor contact info | Public → Local | "How to apply to Burn Boot Camp" |
| User's net worth | **NOWHERE** | Stays on laptop, used for local filtering |
| User's goals/preferences | **NOWHERE** | Stays on laptop, used for local scoring |
| User's location | **NOWHERE** | Stays on laptop, used for local territory check |
| User's risk tolerance | **NOWHERE** | Stays on laptop, used for local matching |

This is the foundational insight: **the information asymmetry is in the user's favor.** Franchise data is public. User data is private. An agent architecture should respect this asymmetry, not flatten it.

---

## Part 2: Franzy Deconstruction — Five Functions with Data Flows

### Function 1: Franzy Fit Score (Matching)

**What Franzy does:** Collects user goals, financial situation, and preferences via a 5-minute quiz. Runs proprietary algorithm on Franzy's servers. Returns scored franchise matches.

**Data flow:** User PII → Franzy servers → Algorithm → Scored results → User

**What the user actually gets:** A ranked list of franchises that fit their criteria.

**What Franzy gets:** A complete personal/financial/professional profile of a motivated buyer — the most valuable lead data in franchising.

**The privacy cost:** Your entire financial and aspirational profile is now in a third-party database, available to Franzy for lead monetization, available to data breaches, and available to Franzy's "brand partners."

### Function 2: Research Tools (Franchise Intelligence)

**What Franzy does:** Aggregates franchise data — gross revenue, investment ranges, unit counts, founding year, industry classification — for 775+ brands across 17 industries.

**Data flow:** Franchise public data → Franzy database → Filtered views → User

**What the user actually gets:** Structured, comparable franchise profiles.

**What Franzy gets:** Behavioral data on what the user searches for, which profiles they view, how long they spend — all feeding the lead-scoring model.

**The privacy cost:** Your research behavior reveals intent. Spending 20 minutes on senior care franchises tells Franzy more about you than your quiz answers.

### Function 3: Franzy Connect (Franchisor Introduction)

**What Franzy does:** Facilitates territory requests and introductions between prospective franchisees and franchisors.

**Data flow:** User profile + intent → Franzy → Franchisor (as a "qualified lead")

**What the user actually gets:** An introduction to the franchise brand.

**What Franzy gets:** Completed lead generation — this is Franzy's revenue event. The franchisee IS the product being sold to the franchisor.

**The privacy cost:** Maximum. Your full profile is transmitted to a franchisor you haven't vetted yet. You've lost negotiating leverage because the franchisor knows your budget before you've asked them a single question.

### Function 4: Financing Pre-Qualification

**What Franzy does:** Asks financial questions, connects users with lending partners.

**Data flow:** User financials → Franzy → Lending partners → Pre-qualification → User

**What the user actually gets:** A sense of borrowing capacity.

**What Franzy gets:** Financial qualification data that further enriches the lead profile.

**The privacy cost:** Your financial details are now shared with Franzy AND their lending partners. Multiple parties have your sensitive financial data.

### Function 5: Education (Content & Guidance)

**What Franzy does:** Blog, podcast, newsletter, Franchising 101 guide, FAQ.

**Data flow:** Franzy content → User (but tracked: what you read, when, how often)

**What the user actually gets:** General franchise education.

**What Franzy gets:** Engagement signals that feed lead scoring.

**The privacy cost:** Even passive consumption is monitored and monetized.

---

## Part 3: The Local-First Agent Architecture

### Design Principle: Inbound-Only Data Flow

```
┌─────────────────────────────────────────────────────────┐
│                    USER'S LAPTOP                         │
│                                                         │
│  ┌──────────────┐    ┌──────────────┐                  │
│  │  User Profile │    │  Local LLM   │                  │
│  │  (encrypted)  │    │  (inference)  │                  │
│  │              │    │              │                    │
│  │ - Net worth  │    │  Matching    │                    │
│  │ - Goals      │◄──►│  Scoring     │                    │
│  │ - Location   │    │  Analysis    │                    │
│  │ - Risk       │    │              │                    │
│  │ - Experience │    └──────────────┘                    │
│  └──────────────┘            ▲                          │
│         │                    │                          │
│         │ (never exits)      │ (public data only)       │
│         ▼                    │                          │
│  ┌──────────────┐    ┌──────────────┐                  │
│  │  Franchise   │◄───│  Agent       │                  │
│  │  Data Store  │    │  Orchestrator│                  │
│  │  (local DB)  │    │              │                  │
│  └──────────────┘    └──────┬───────┘                  │
│                             │                          │
└─────────────────────────────┼──────────────────────────┘
                              │
              ════════════════╪═══════════════  PRIVACY WALL
              Agents go OUT   │   Nothing about
              to fetch PUBLIC │   the USER goes out
              data IN         │
                              │
         ┌────────────────────┼────────────────────┐
         │                    │                    │
    ┌────▼─────┐    ┌───────▼────┐    ┌────────▼──────┐
    │  Scout   │    │  Analyst   │    │  Connector    │
    │  Agent   │    │  Agent     │    │  Agent        │
    │          │    │            │    │               │
    │ Fetches: │    │ Fetches:   │    │ Fetches:      │
    │ -Listings│    │ -FDDs      │    │ -Contact info │
    │ -Profiles│    │ -Financials│    │ -Application  │
    │ -Reviews │    │ -Litigation│    │  requirements │
    └──────────┘    └────────────┘    └───────────────┘
         │                │                    │
    ┌────▼────┐    ┌─────▼──────┐    ┌───────▼───────┐
    │ Public  │    │ State AG   │    │ Franchise     │
    │ Listings│    │ Offices    │    │ Brand Sites   │
    │ Sites   │    │ SEC/FDD    │    │               │
    └─────────┘    └────────────┘    └───────────────┘
```

### The Privacy Wall

The dashed line is the **privacy wall** — the single most important architectural boundary in the system:

- **Above the wall:** User data, local computation, encrypted storage. NOTHING crosses down.
- **Below the wall:** Agents fetching PUBLIC information from PUBLIC sources. They don't know who the user is. They don't carry user data in their prompts. They fetch franchise data the same way you'd Google it — except they do it systematically and at scale.

**Key insight:** When a Scout Agent queries "list all home service franchises with investment under $100K," that query contains ZERO user PII. It's a search over public data. The fact that the user's budget IS $100K is never transmitted — the agent just fetches all franchises in that bracket and brings the data back. The filtering against the user's actual budget happens locally.

### Privacy-Preserving Query Design

Even the queries agents send externally are designed to avoid inference attacks:

| Naive Query (leaks intent) | Privacy-Preserving Query |
|----------------------------|--------------------------|
| "Franchises in Austin TX under $80K for a career-changer" | "All franchises in TX" + local filter for Austin + local filter for budget + local filter for experience level |
| "Senior care franchises for someone with $200K net worth" | "All senior care franchises" + local affordability check |

The agent fetches **broad public data** and the local system **narrows it privately**. Over-fetching is a feature, not a bug — it provides privacy through generality.

---

## Part 4: Agent Type Definitions

### Agent 1: Scout Agent

**Role:** Universe discovery — finds and catalogs franchise opportunities from public sources

**Tools:**
- Web scraping (franchise directories, IFA listings, state registration databases)
- Structured data extraction (franchise profiles, investment ranges, territory maps)
- RSS/news monitoring (new franchise launches, industry trends)

**Data Access:** NONE of user profile. Fetches public data unconditionally.

**Constraints:**
- Never receives user preferences, budget, or location in its prompt
- Fetches broad datasets (all franchises in an industry, not filtered by user criteria)
- Stores results in local Franchise Data Store only
- Runs on schedule or on-demand, independent of user interaction

**Output:** Structured franchise records → Local DB

**Privacy guarantee:** Scout Agent could be run on a public computer and produce identical results. It has zero knowledge of the user.

### Agent 2: Analyst Agent

**Role:** Deep due diligence on specific franchise brands

**Tools:**
- FDD document retrieval (state AG offices, SEC EDGAR for public companies)
- Financial statement analysis (unit economics, failure rates, litigation history)
- News/review aggregation (franchisee satisfaction, brand reputation)
- Competitive analysis (how this franchise compares to peers in its segment)

**Data Access:** Minimal — receives franchise brand name only. May receive user's "investigation priority list" (brand names, not user data).

**Constraints:**
- Never receives user financial data
- Fetches FDD data and public financials for named brands
- Produces structured analysis reports stored locally
- Cannot initiate contact with any franchisor

**Output:** Due diligence report per franchise → Local DB

**Privacy guarantee:** The Analyst asks "Tell me everything about Franchise X" — not "Is Franchise X good for a person with Y budget in Z location?"

### Agent 3: Matcher Agent (LOCAL ONLY)

**Role:** Scores franchise-user fit — the core matching algorithm

**Tools:**
- Local LLM inference (runs on-device: Llama 3.1 8B, Mistral 7B, or similar)
- Scoring algorithm (weighted multi-factor matching)
- Local database queries (reads both User Profile and Franchise Data Store)

**Data Access:** FULL access to user profile AND franchise data — but runs ENTIRELY locally.

**Constraints:**
- **NEVER makes network calls.** This is the cardinal rule. The Matcher Agent is air-gapped from the internet.
- Runs local model inference only (no API calls to OpenAI, Anthropic, etc.)
- If local model quality is insufficient, it flags for human review — never sends data to a cloud model
- Produces scored rankings stored in local DB

**Output:** Ranked franchise matches with fit scores and reasoning → Local UI

**Privacy guarantee:** The Matcher Agent runs in a sandboxed environment with no network access. Even if compromised, it cannot exfiltrate data because it has no network socket.

### Agent 4: Finance Agent (LOCAL ONLY)

**Role:** Affordability analysis and financing scenario modeling

**Tools:**
- Local financial calculator (loan amortization, ROI modeling, cash flow projection)
- Public rate data (fetched by Scout Agent, not by Finance Agent directly)
- Scenario modeling (what-if analysis across different financing structures)

**Data Access:** User financial profile + franchise cost data. Runs ENTIRELY locally.

**Constraints:**
- **NEVER makes network calls.** Same air-gap as Matcher Agent.
- Does NOT contact lenders, banks, or financing platforms
- Produces feasibility analysis stored locally
- When user CHOOSES to seek financing, the system generates a "financing packet" that the user MANUALLY shares with their chosen lender — the agent doesn't transmit it

**Output:** Affordability reports, financing scenarios → Local UI

**Privacy guarantee:** Air-gapped. User controls when/if/how financial information is shared with lenders through their own manual action.

### Agent 5: Connector Agent

**Role:** Facilitates user-initiated contact with franchisors

**Tools:**
- Contact information retrieval (public franchisor websites, application portals)
- Application requirement aggregation (what each franchisor needs to start the process)
- Template generation (draft inquiry letters, application forms — stored locally)

**Data Access:** Franchise contact data only. Does NOT have access to user profile.

**Constraints:**
- **Never sends any communication on behalf of the user.** Prepares materials; user sends them.
- Retrieves public contact/application information only
- Generates draft communications stored locally for user review and manual sending
- Does not auto-fill user data into application forms — user does this themselves

**Output:** Contact packages per franchise (who to contact, how, what they need) → Local UI

**Privacy guarantee:** The Connector Agent doesn't know the user's name. It fetches "how to apply to Franchise X" — the user fills in their own details when they're ready.

### Agent 6: Educator Agent

**Role:** Franchise education and decision support

**Tools:**
- Content aggregation (public franchise education resources, IFA guides, legal primers)
- Q&A via local LLM (answers franchise questions using locally-cached knowledge)
- Decision framework generation (helps user structure their thinking)

**Data Access:** May access user's stated goals (not financials) for personalized guidance. Runs locally.

**Constraints:**
- Primarily local inference with cached educational content
- Any web fetches are for public educational content (no user data in queries)
- Doesn't access financial profile

**Output:** Educational content, decision frameworks → Local UI

---

## Part 5: Agent Orchestration

### The Orchestrator Pattern

```
User Intent
    │
    ▼
┌──────────────────────┐
│   LOCAL ORCHESTRATOR  │
│                      │
│  1. Parse intent     │
│  2. Select agents    │
│  3. Scope queries    │  ◄── Strips PII from all outbound work
│  4. Dispatch agents  │
│  5. Collect results  │
│  6. Local matching   │
│  7. Present to user  │
└──────────────────────┘
    │              │
    │              │
    ▼              ▼
 OUTBOUND        LOCAL
 (no PII)      (full PII)
    │              │
    ▼              ▼
Scout Agent    Matcher Agent
Analyst Agent  Finance Agent
Connector      Educator Agent
```

### Orchestration Rules

1. **PII Firewall:** The Orchestrator is responsible for ensuring no user data enters any outbound agent's prompt or parameters. It translates user intent into PII-free queries.

2. **Broad Fetch, Local Filter:** Outbound agents fetch broad datasets. The Orchestrator + local agents narrow results using user data that never leaves the machine.

3. **Agent Isolation:** No agent can communicate directly with another agent. All inter-agent communication flows through the Orchestrator, which enforces data-access boundaries.

4. **User-Controlled Disclosure:** When the process reaches a point where information MUST be shared (e.g., contacting a franchisor), the system prepares materials but the USER performs the action. The system never sends anything on the user's behalf.

5. **Progressive Disclosure to User:** Results flow from broad (Scout: 775 franchises) → filtered (Matcher: top 20 matches) → deep (Analyst: full due diligence on top 5) → actionable (Connector: how to apply to top 3). Each stage requires user approval before proceeding.

### Example Workflow: "Find me the perfect franchise"

```
Step 1: Educator Agent
  → Helps user articulate goals, risk tolerance, budget
  → Stored LOCALLY in encrypted user profile
  → No network activity

Step 2: Scout Agent (outbound, no PII)
  → Fetches all franchises across all categories from public sources
  → Builds local franchise database (775+ brands with structured data)
  → Query: "GET /franchises" — not "GET /franchises-for-nick"

Step 3: Matcher Agent (local only, air-gapped)
  → Reads user profile + franchise database
  → Scores every franchise against user criteria
  → Produces ranked list with reasoning
  → All computation on-device

Step 4: User reviews top matches, selects 5-10 for deep dive

Step 5: Analyst Agent (outbound, no PII)
  → Fetches FDD documents for selected brands
  → Retrieves litigation history, financial performance data
  → Query: "GET FDD for Brand X" — not "GET FDD for Brand X because Nick has $150K"
  → Produces due diligence reports stored locally

Step 6: Finance Agent (local only, air-gapped)
  → Models affordability for each shortlisted franchise
  → Runs financing scenarios (SBA loan, ROBS, home equity, etc.)
  → All computation on-device

Step 7: User narrows to 2-3 finalists

Step 8: Connector Agent (outbound, no PII)
  → Fetches application requirements for finalist brands
  → Generates draft inquiry letters (user fills in their own details)
  → Query: "How to apply to Brand X" — no user data transmitted

Step 9: USER sends inquiries manually
  → Full control over what personal information is shared, with whom, and when
  → The user is the data controller, not the platform
```

---

## Part 6: Privacy Threat Model

### Threat Vectors and Mitigations

| Vector | Threat | Mitigation |
|--------|--------|------------|
| **Agent Prompts** | LLM API calls could contain user data if prompts are poorly constructed | Outbound agents (Scout, Analyst, Connector) NEVER receive user profile data. Orchestrator enforces PII stripping. Local agents (Matcher, Finance) are air-gapped. |
| **LLM API Telemetry** | Cloud LLM providers could log prompts | Local agents use local models only. Outbound agents send only public-data queries (no PII to log). |
| **Inference Attacks** | Narrow queries could reveal user preferences (e.g., searching only Austin senior care franchises reveals location + interest) | Broad fetch strategy: Scout gets ALL franchises, local filter narrows. Over-fetching prevents inference. |
| **Franchise Data Store** | Local database could be compromised | Encrypted at rest using OS keychain (macOS Keychain, Windows DPAPI). Franchise data is public and non-sensitive, but user annotations/scores ARE sensitive. |
| **User Profile Store** | Local profile could be read by malware | Encrypted at rest. Decryption requires user authentication (biometric/password). Profile stored in sandboxed app directory. |
| **Financing Disclosure** | User needs to share financial data with lenders eventually | System does NOT automate this. Finance Agent models scenarios locally. When user is ready, they generate a "financing packet" and MANUALLY share it with their chosen lender. The agent system is not in the loop. |
| **Franchisor Contact** | Eventually user must identify themselves to a franchisor | System prepares materials but user sends them manually. User chooses WHEN to disclose identity and HOW MUCH to share. They can contact a franchisor knowing more about the franchise than the franchisor knows about them — reversing the information asymmetry. |
| **Network Metadata** | ISP/network observer sees which franchise sites are being fetched | Optional: route outbound agents through VPN/Tor. Broad fetching also helps — fetching all 775 franchise profiles doesn't reveal which one you care about. |

### Data Compartmentalization

```
┌─────────────────────────────────────────┐
│           USER'S LAPTOP                  │
│                                         │
│  ┌───────────────┐  ┌───────────────┐  │
│  │ VAULT A       │  │ VAULT B       │  │
│  │ User Profile  │  │ Franchise DB  │  │
│  │ (encrypted)   │  │ (encrypted)   │  │
│  │               │  │               │  │
│  │ Accessed by:  │  │ Accessed by:  │  │
│  │ - Matcher     │  │ - All agents  │  │
│  │ - Finance     │  │               │  │
│  │ - Educator    │  │ (public data, │  │
│  │               │  │  but user     │  │
│  │ NOT by:       │  │  annotations  │  │
│  │ - Scout       │  │  are private) │  │
│  │ - Analyst     │  │               │  │
│  │ - Connector   │  └───────────────┘  │
│  └───────────────┘                      │
│                                         │
│  ┌───────────────┐  ┌───────────────┐  │
│  │ VAULT C       │  │ VAULT D       │  │
│  │ Match Results │  │ Agent Logs    │  │
│  │ (encrypted)   │  │ (encrypted)   │  │
│  │               │  │               │  │
│  │ Scores, ranks │  │ Query history │  │
│  │ User notes    │  │ Fetch records │  │
│  │ Comparisons   │  │ (no PII in    │  │
│  │               │  │  outbound     │  │
│  │               │  │  queries)     │  │
│  └───────────────┘  └───────────────┘  │
└─────────────────────────────────────────┘
```

Four encrypted vaults, each with distinct access policies. No single agent can access all four. Compromise of any one vault does not expose the others.

---

## Part 7: Strategic Analysis — Why This Disrupts Franzy

### Franzy's Revenue Model Dependency

Franzy's business model is **lead generation**: collect user profiles, qualify them, sell qualified leads to franchisors. The user's data IS the product. Franzy's free tier exists to capture leads, not to serve users.

A local-first agent system obliterates this model:
- No user profiles exist on any server → no leads to sell
- The user contacts franchisors directly → no intermediary needed
- The user knows more about the franchise than the franchise knows about them → reversed information asymmetry

### What Local-First Makes Possible (Impossible in Franzy)

**1. Honest Scoring Without Conflicts of Interest**

Franzy's match scores may be influenced by which franchisors pay more for leads. A local Matcher Agent scores purely on fit — there's no monetization pressure to rank paying brands higher. The user can inspect the scoring algorithm. It's their software running on their machine.

**2. Adversarial Due Diligence**

A local Analyst Agent can pull NEGATIVE information about franchises — litigation history, franchisee complaints, failure rates, FDD red flags — without any platform filtering it for "brand partner" protection. Franzy has a structural conflict: their revenue comes from franchisors, not franchisees. A local system has no such conflict.

**3. Cross-Platform Intelligence**

A local system isn't limited to Franzy's 775 franchises. Scout Agents can scrape Franchise Direct (1,500+), FranNet, Franchise Gator, state registrations, IFA databases, and direct brand websites. The user gets the entire franchise universe, not one platform's curated subset.

**4. Negotiating Leverage Through Information Asymmetry Reversal**

In Franzy's model, the franchisor receives the user's full profile before first contact — the user negotiates from a position of disclosure. In the local-first model, the user has deep due diligence on the franchisor (FDD analysis, litigation history, unit economics, competitive positioning) while the franchisor knows nothing about the user until the user chooses to share. This is a profound power shift.

### The Financing Tension — Honest Treatment

The one area where local-first cannot be absolute is financing. Getting a loan requires disclosing financial information to a lender. This is irreducible — you cannot borrow money anonymously.

**The local-first solution:**

1. **Local pre-screening:** Finance Agent models your borrowing capacity locally using publicly-known lending criteria (SBA 7(a) requirements, ROBS eligibility rules, etc.). You know whether you're likely to qualify BEFORE sharing data with anyone.

2. **User-controlled selective disclosure:** When ready, the user generates a "financing packet" containing exactly what they choose to share. They select the lender. They send it themselves. No platform intermediary.

3. **Separation of discovery from financing:** In Franzy's model, your financial data is captured during discovery (the quiz) — before you've even decided which franchise to pursue. In the local-first model, financial disclosure only happens at the financing stage, after you've already selected a franchise through private analysis. The blast radius of disclosure is minimized.

---

## Part 8: Value Comparison Matrix

| Function | Franzy (Centralized) | Local-First Agents | Winner |
|----------|---------------------|-------------------|--------|
| **Discovery breadth** | 775 franchises, 17 industries | Unlimited — agents scrape all public sources | Local-First |
| **Match quality** | Proprietary algorithm, potential sponsor bias | Transparent local algorithm, zero conflicts | Local-First |
| **Speed of matching** | Fast (server-side) | Moderate (local inference) | Franzy |
| **Due diligence depth** | Surface-level profiles (revenue, investment, units) | Deep FDD analysis, litigation, franchisee reviews | Local-First |
| **Privacy** | Full profile captured and monetized | Zero data leaves laptop | Local-First |
| **Financing** | Integrated but data-capturing | Local modeling + manual disclosure | Tie (different tradeoffs) |
| **Franchisor connection** | Automated but exposes full profile | Manual but preserves information advantage | Local-First for savvy users |
| **Ease of use** | Simple web UI, 5-minute quiz | Requires technical setup, agent management | Franzy |
| **Cost to user** | Free (user is the product) | Agent compute costs (local LLM, API calls for public data) | Franzy (financial), Local-First (total cost including privacy) |
| **Negotiating position** | Franchisor knows everything about you | You know everything about them; they know nothing about you | Local-First |
| **Education** | Blog, podcast, guides | Aggregated from all public sources + personalized local guidance | Local-First |
| **Conflict of interest** | Revenue from franchisors = structural bias | None — system serves only the user | Local-First |

### The Honest Tradeoff

Local-first wins on **depth, privacy, honesty, and negotiating leverage.** Franzy wins on **ease of use and speed of initial matching.** The question is whether a prospective franchisee — someone about to invest $50K-$500K of their life savings — would trade convenience for the ability to make a fully-informed, privately-analyzed, conflict-free decision.

For a $200 purchase, Franzy's convenience wins. For a life-changing investment, the local-first model's depth and privacy win overwhelmingly.

---

## Part 9: Implementation Stack (Practically Buildable)

```
LOCAL RUNTIME
├── Claude Code (agent orchestrator)
│   ├── Scout Agent (claude -p "fetch franchise listings from [source]")
│   ├── Analyst Agent (claude -p "analyze FDD for [brand]")
│   ├── Connector Agent (claude -p "find application info for [brand]")
│   └── Educator Agent (claude -p "explain [franchise concept]")
│
├── Local LLM (Ollama / llama.cpp)
│   ├── Matcher Agent (local inference only, no network)
│   └── Finance Agent (local inference only, no network)
│
├── Local Database (SQLite, encrypted)
│   ├── Vault A: User Profile (AES-256)
│   ├── Vault B: Franchise Data (AES-256)
│   ├── Vault C: Match Results (AES-256)
│   └── Vault D: Agent Logs (AES-256)
│
└── Local UI (terminal / local web server on localhost)
    └── Dashboard showing matches, analysis, progress
```

**Technology choices:**
- **Claude Code** as the orchestrator (already handles agent spawning, tool use, and coordination)
- **Ollama** for local LLM inference (Matcher and Finance agents — air-gapped)
- **SQLite** with encryption for local data storage (lightweight, no server)
- **Standard web scraping** for public data collection (Playwright, Puppeteer)
- **macOS Keychain / DPAPI** for encryption key management

This is buildable TODAY with existing tools. No new infrastructure required.

---

## Conclusion: The Asymmetry That Changes Everything

Franzy's implicit argument is: "Give us your data, and we'll find you a franchise." The local-first argument is: "Keep your data, and your agents will find you a franchise."

The second argument is stronger because franchise discovery has a unique property: **almost all the useful information is public.** FDDs are public. Franchise listings are public. Investment ranges are public. Franchisor contact information is public. The only private data is the user's — and it never needs to leave their machine for the matching to work.

This isn't a privacy-for-convenience tradeoff. It's a **privacy AND capability improvement** — because a local system can be more honest (no sponsor bias), more thorough (not limited to one platform's database), and more empowering (reversed information asymmetry) than any centralized alternative.

The future of AI for high-stakes personal decisions isn't "upload your life to the cloud and hope for the best." It's "your data stays home, your agents go to work, and you make the decision from a position of strength."
