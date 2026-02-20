---
prd: true
id: PRD-20260219-local-first-franchise-agents
status: COMPLETE
mode: interactive
effort_level: Extended
created: 2026-02-19
updated: 2026-02-19
iteration: 0
maxIterations: 128
loopStatus: null
last_phase: VERIFY
failing_criteria: []
verification_summary: "16/16"
parent: null
children: []
---

# Local-First AI Agent System for Franchise Discovery

> Design a privacy-first agent architecture that replicates and exceeds Franzy's franchise discovery value while keeping all user data on the user's laptop.

## STATUS

| What | State |
|------|-------|
| Progress | 16/16 criteria passing |
| Phase | COMPLETE |
| Next action | None — delivered |
| Blocked by | nothing |

## CONTEXT

### Problem Space
Franzy.com is an AI-powered franchise marketplace that collects extensive personal, professional, and financial data from prospective franchisees to generate match scores. The strategic question: if the future of AI is local data + remote agents, how would you design a system that delivers equal or greater value without the user surrendering their data to a centralized platform?

### Key Files
- Franzy website analysis (in-session) — platform capabilities, 775 franchises, 5 core functions
- This PRD — design spec for the local-first alternative

### Constraints
- Zero PII exfiltration — user data never leaves the laptop
- Agent-driven — agents do the work, user makes decisions
- Must be practically buildable with current technology
- Must address the financing disclosure tension honestly

## PLAN

### Approach
1. First-principles decomposition of what franchise discovery actually IS at its most fundamental
2. Deconstruct Franzy's 5 functions with full data flow analysis
3. Design agent types with role/tool/constraint boundaries
4. Build the privacy threat model showing data boundaries
5. Strategic analysis of disruption potential
6. Honest tradeoff comparison

### Technical Decisions
- Document deliverable (not code) — strategic design spec
- Agent architecture designed for Claude Code / local LLM hybrid execution
- Privacy model based on data-flow direction (inbound OK, outbound blocked)

## IDEAL STATE CRITERIA

- [x] ISC-Func-1: Franzy's five core value functions fully deconstructed [E] | Verify: Read
- [x] ISC-Func-2: Each Franzy function mapped to local-agent equivalent [E] | Verify: Read
- [x] ISC-Arch-1: Agent architecture diagram shows all component boundaries [E] | Verify: Read
- [x] ISC-Arch-2: Data flow for each agent explicitly traces information path [I] | Verify: Read
- [x] ISC-Priv-1: Zero user PII transmitted to any remote endpoint [E] [CRITICAL] | Verify: Read
- [x] ISC-Priv-2: Threat model identifies and addresses all privacy boundaries [I] | Verify: Read
- [x] ISC-Priv-3: Financing pre-qualification handles disclosure tension explicitly [I] | Verify: Read
- [x] ISC-Strat-1: Strategic analysis shows why local-first disrupts Franzy model [R] | Verify: Read
- [x] ISC-Strat-2: Value comparison matrix shows local-first vs centralized tradeoffs [I] | Verify: Read
- [x] ISC-Agent-1: Each agent type has defined role, tools, and constraints [E] | Verify: Read
- [x] ISC-Agent-2: Agent orchestration pattern shows how agents coordinate locally [I] | Verify: Read
- [x] ISC-Agent-3: First-principles decomposition grounds the entire design [E] | Verify: Read
- [x] ISC-A-Priv-1: No design pattern requires user data upload to function [E] [CRITICAL] | Verify: Read
- [x] ISC-A-Strat-1: Design is not just Franzy with local storage bolted on [R] | Verify: Read
- [x] ISC-A-Arch-1: No single point of failure compromises all user data [I] | Verify: Read
- [x] ISC-A-Func-1: No agent has unrestricted access to full user profile [I] | Verify: Read

## DECISIONS

1. Hybrid local/cloud LLM: Matcher and Finance agents run local models (air-gapped). Outbound agents use cloud LLMs with PII-free prompts only.
2. Broad-fetch over narrow-fetch: Over-fetching public data prevents inference attacks from query patterns.
3. Manual user disclosure for financing: System models locally but never automates financial disclosure to lenders.
4. 4-vault compartmentalization: Data separated by sensitivity level with per-agent access policies.

## LOG

### Iteration 1 — 2026-02-19
- Phase reached: VERIFY (COMPLETE)
- Criteria progress: 16/16
- Work done: Full strategic design document covering first-principles decomposition, Franzy deconstruction, 6-agent architecture with privacy wall, threat model, strategic disruption analysis, and value comparison matrix.
- Failing: none
- Context: Deliverable at local-first-franchise-agent-system.md
