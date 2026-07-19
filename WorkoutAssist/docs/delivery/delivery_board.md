# DELIVERY BOARD

_Board status reconciled with the codebase: 2026-07-19._

> **Note on this board:** it was authored as an artifact-first planning template before implementation began. The MVP was subsequently built without the formal artifact/evidence gates, so the **Status** column below now reflects *implementation reality*, while the **Primary Artifacts / Evidence** columns remain largely unfilled — that governance debt is real and is tracked in `docs/PREDEPLOYMENT_LAUNCH_CHECK.md`. Treat "MVP Built" as "code is live and working on web" — **not** as "passed the Definition of Done", which still requires evidence capture, rules audit, and native QA.

## Section 1 — Program Overview

**Product Scope & MVP**: WorkoutAssist is a React Native + Firebase application focused on guided workout planning and tracking. The MVP includes user authentication, onboarding, exercise catalog, plan creation, guided workout player, history logging, and basic metrics. The scope emphasizes a default-deny security model, per-user data isolation, and global read-only catalogs.

**Review Workflow**: We follow an artifact-first delivery model. Before any code merges, the Epic Owner must produce and gain approval for all primary artifacts (Schema, UI Flow, Security Rules). Code is reviewed only after the implementation plan is approved. Evidence of testing (screenshots/recordings) is required for the "Ready for Review" gate.

**Definition of Done (Epic-Level)**: An epic is Done when: 1/ All artifacts are approved. 2/ Code is merged and deployed to dev/staging. 3/ Security rules are verified (audited). 4/ All evidence items are logged in the Evidence Catalog. 5/ No critical bugs (P0/P1) remain open. 6/ Feature flags (Remote Config) are set and documented.

## Section 2 — Board Status Legend

### Status Values
- **Not Started**: No work begun.
- **In Progress**: Planning or Implementation active.
- **Blocked**: Waiting on dependency or external decision.
- **Ready for Review**: All artifacts/evidence ready for sign-off.
- **Changes Requested**: Reviewer pushed back; rework needed.
- **Approved**: All gates passed; ready to merge/deploy.
- **Released**: In production (or MVP baseline equivalent).

### Review Gates
- **Architecture**: Data model, scalability, and system design.
- **Data Model**: Firestore schema structure and indexes.
- **Security Rules**: Firestore/Storage rules compliance.
- **QA**: Functional testing and UI polish.
- **Release**: Final smoke test and feature flag check.

## Section 3 — Delivery Board Table

| Epic ID | Epic Name | Priority | Status | Primary Artifacts | Security Impact | Review Gates | Evidence Required | Owner Role | Reviewer Role | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **P0.0** | Project Baseline | P0 | 🟡 Partial | [x] Repo Setup<br>[ ] CI/CD | High | Security, Arch | Hello World Screenshot | Tech Lead | Architect | Repo/nav/Firebase live. **No CI/CD, no App Check** |
| **P0.1** | Auth + Profile Bootstrap | P0 | ✅ MVP Built | [x] Auth Flow<br>[x] User Doc Schema | High | Security, Data | Sign-in Video, Firestore User Doc | Dev | Tech Lead | Email + guest + guest→account migration. Rules audit pending |
| **P0.2** | Onboarding & Preferences | P0 | ✅ MVP Built | [x] Onboarding UX<br>[x] Prefs Schema | Low | QA, Data | Flow Walkthrough | Dev | Product | Goal/experience/equipment/schedule/injuries/timezone |
| **P0.3** | Exercise Catalog | P0 | ✅ MVP Built | [x] JSON Data<br>[x] Import Script | Med | Data, Security | Admin Write Video | Dev | Tech Lead | 20 exercises + custom exercises + favorites. **Firestore re-seed pending** |
| **P0.4** | Plan Templates + Create | P0 | 🟡 Partial | [x] Plan Schema<br>[x] UI Mockup | Med | Data, QA | Plan Creation Video | Dev | Product | Templates + create-from-template done. **Arbitrary-exercise plan builder not built** |
| **P0.5** | Guided Workout Player | P0 | ✅ MVP Built | [x] State Machine<br>[x] Logger Logic | Low | Arch, QA | Full Session Video | Dev | Tech Lead | Timer, set logging, rest, resume/save-exit. Offline/resume QA pending |
| **P0.6** | History + Progress | P0 | ✅ MVP Built | [x] History Schema<br>[x] Summary Func | Med | Data, Arch | Log View Screenshot | Dev | Tech Lead | Server-side streak/volume/PR/XP aggregation |
| **P0.7** | Notifications | P0 | 🔴 Not Started | [ ] FCM Setup<br>[ ] Trigger Logic | Low | Security, QA | Push Receipt Screen | Dev | Product | **Prefs UI only — `expo-notifications` not installed** |
| **P0.8** | Entitlements + Paywall | P0 | 🟡 Partial | [ ] RC Defaults<br>[x] Gate Logic | High | Security, Release | Paywall Flow Video | Tech Lead | Architect | Tiers + gating + server-only entitlement writes live. **No payment provider; upgrade is a stub** |
| **P1.0** | Exercise Demo Media | P1 | ✅ MVP Built | [x] Video Pipeline<br>[x] Fallback Chain | Low | QA, Arch | Detail-screen recording | Dev | Product | 15/20 videos, 20/20 infographics, detail carousel. Verified on web **and Android emulator**; ~12.9 MB bundled |
| **P1.1** | Native Android Bring-Up | P1 | ✅ MVP Built | [x] Expo prebuild<br>[ ] Build runbook | Low | Arch, QA | Emulator screenshots | Dev | Tech Lead | Project had been scaffolded as plain RN; 4 blockers fixed (autolinking, dep hoisting, babel preset, Firebase auth). **iOS + share sheet still unverified** |

## Section 4 — Epic Cards

### P0.0 — Project Baseline
- **Scope**: Repo init, ESLint/Prettier, Firebase Project link, Navigation Shell.
- **Artifacts**: Implementation Plan, Package.json review.
- **Security**: API Keys restriction, App Check (planned).
- **Evidence**: Screenshot of running app ("Hello World"), Screenshot of Firebase connection.
- **Gates**: Architecture, Security.
- **Release Criteria**: Builds in CI, installs on device.

### P0.1 — Auth + Profile Bootstrap
- **Scope**: Sign up/in (Email/Google), Anonymous upgrade, `users/{uid}` creation.
- **Artifacts**: Auth State Flow, User Schema.
- **Security**: Allow only `request.auth.uid == uid` for user doc.
- **Evidence**: Video of full auth flow, Screenshot of Firestore Console showing created user.
- **Gates**: Security Rules, Data Model.
- **Risk**: Improper ACLs on user creation.

### P0.2 — Onboarding & Preferences
- **Scope**: User details (height/weight/goals), unit preferences (metric/imperial).
- **Artifacts**: UI Flow, Preference Schema.
- **Security**: Validate input types (no checking scripts).
- **Evidence**: Video of onboarding completion, verify data persistence.
- **Gates**: QA, Data Model.
- **Release Criteria**: User completes onboarding once.

### P0.3 — Exercise Catalog (Read-Only)
- **Scope**: Global exercise list, Admin tools to populate/edit.
- **Artifacts**: Seed Data JSON, Schema (Exercises).
- **Security**: Global Read, Admin-only Write.
- **Evidence**: Screenshot of "User cannot edit", Video of Admin import.
- **Gates**: Security Rules, Data Model.
- **Release Criteria**: Catalog populated with base data.

### P0.4 — Plan Templates + Create My Plan
- **Scope**: Browse templates, Copy template to User Plan, Edit Custom Plan.
- **Artifacts**: Plan Schema (nested collections vs array), UI Flow.
- **Security**: User can only create/edit their own plans.
- **Evidence**: Video: "Create from Template", Video: "Create Custom".
- **Gates**: Data Model, QA.
- **Release Criteria**: Plan saves correctly to Firestore.

### P0.5 — Guided Workout Player
- **Scope**: Active session view, Timer, Set logging, Resume active session.
- **Artifacts**: Player State Diagram, Session Schema.
- **Security**: Robust write rules for session logs.
- **Evidence**: Full workout session video (start to finish).
- **Gates**: Architecture, QA.
- **Release Criteria**: No data loss on app kill/resume.

### P0.6 — History + Progress
- **Scope**: List past workouts, 1RM summary, Volume summary.
- **Artifacts**: Aggregation Strategy (Cloud Function vs Client), Schema.
- **Security**: Read-only historical data (log append-only logic?).
- **Evidence**: Screenshot of History List, Screenshot of Graphs.
- **Gates**: Data Model, Architecture.
- **Release Criteria**: Summary metrics accurately reflect logs.

### P0.7 — Notifications + Reminders
- **Scope**: Local reminders (workout time), FCM operational messages.
- **Artifacts**: Notification Permission Flow, Topics definition.
- **Security**: Prevent spamming users.
- **Evidence**: Screenshot of permission dialog, Screenshot of received notification.
- **Gates**: QA, Security.
- **Release Criteria**: Permissions handled gracefully (denied/accepted).

### P0.8 — Entitlements + Paywall Gates
- **Scope**: Remote Config for "Premium", UI Paywall, Feature gating.
- **Artifacts**: Remote Config JSON defaults, Gate Logic map.
- **Security**: Logic MUST be robust; no client-side "isPremium" flag writes.
- **Evidence**: Video of Paywall blocking feature, Video of Unlock.
- **Gates**: Security, Release.
- **Release Criteria**: Defaults to "Locked" if fetch fails.

### P1.0 — Exercise Demo Media (added 2026-07-18)
- **Scope**: Pre-rendered demo videos, AI muscle infographics, and the exercise-detail carousel.
- **Artifacts**: Video production pipeline (`docs/VISUAL_UPGRADE_TOOLING.md`), id-keyed asset registries, fallback chain.
- **Security**: None (bundled static assets, no new read/write paths).
- **Evidence**: Detail-screen recording showing video playback, infographic, and carousel paging.
- **Gates**: QA, Architecture.
- **Release Criteria**: Demo never blocks the screen — fallback chain (video → 3D → poster → SVG) holds when an asset is missing.
- **Status notes**: 15/20 exercises have videos (5 machine exercises are infographic-only **by design**); all 20 have infographics. **Verified on web only.** Bundled media ~12.9 MB — approaching the documented ~15–20 MB Storage-migration trigger.

## Section 5 — Global Evidence Catalog Template

| Evidence ID | Epic | Type | Description | Date | Storage Location | Verified? |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **EV-001** | P0.0 | Screenshot | Emulator Home Screen | YYYY-MM-DD | `docs/evidence/P0.0_home.png` | [ ] |
| **EV-002** | P0.1 | Recording | Auth Flow Success | YYYY-MM-DD | `docs/evidence/P0.1_auth.mp4` | [ ] |

## Section 6 — Risk Register Template

| Risk ID | Risk | Impact | Likelihood | Mitigation | Owner | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **R-001** | Data Migration | High | Low | Version schemas | Architect | Open |
| **R-002** | Offline Sync | Med | Med | Test offline modes | Dev | Open |

## Section 7 — Decision Log Template

| Decision ID | Date | Decision | Alternatives | Reasoning | Implications | Owner |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **D-001** | YYYY-MM-DD | Use Subcollections | arrays | Query scalability | Higher read costs | Architect |

## Section 8 — Release Checklist (MVP)

_Reconciled 2026-07-18. The authoritative, more detailed version is `docs/PREDEPLOYMENT_LAUNCH_CHECK.md` — keep these two in sync._

- [ ] **Security**: Firestore Rules validated (no `allow write: if true`) — rules exist and deny client writes to metrics/entitlements, but a full end-to-end audit + rules unit tests are outstanding.
- [ ] **Security**: Storage Rules validated — Storage currently unused; required before the media→Storage migration.
- [ ] **Data**: Indexes deployed and clean.
- [ ] **Stability**: Crashlytics initialized and sending reports — **no crash SDK installed**.
- [ ] **Analytics**: Core funnel events firing — **event call sites exist but are `console.log` only**; no backend.
- [ ] **Config**: Remote Config defaults confirmed (safe fallback).
- [ ] **Offline**: App does not crash when airplane mode is on.
- [ ] **Compliance**: User data deletion flow exists (or manual process documented).
- [~] **Smoke**: Critical path (Auth → Workout → History) tested on device — the app now **runs on an Android emulator** and Auth → Home → Catalog → Exercise Detail is verified there; the full workout→summary leg (and therefore the share sheet) is still only web-verified. iOS unverified.
- [x] **Tests**: `tsc --noEmit` clean; app suite 11/11 · 97/97 green (newer features intentionally not yet covered).
