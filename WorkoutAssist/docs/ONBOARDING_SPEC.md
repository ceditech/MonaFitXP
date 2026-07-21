# Onboarding — gap analysis & spec

_Written 2026-07-21. Status: **proposal, not implemented.**_

## Start here: onboarding already exists

`app/src/features/onboarding/OnboardingWizard.tsx` is a working 5-step wizard —
Goal → Experience → Equipment → Schedule → Bio — wired into `RootNavigator` behind
`!onboardingCompleted`, persisting to `users/{uid}` and auto-creating an active plan
from a matching template. `functions/src/auth.ts` already seeds
`onboardingCompleted: false` on signup.

**This spec extends that file. It does not replace it.** Rewriting it would throw away
working navigation, plan-seeding, and analytics wiring for no gain.

## What's collected today

| Field | Step |
|---|---|
| `goal`, `experience` | 0, 1 |
| `equipment[]` | 2 |
| `daysPerWeek`, `preferredDays[]` | 3 |
| `injuryFlags[]`, `sessionMinutes`, `timezone` | 4 |

## Gaps against the request

### G1 — Identity fields missing (name, age)
Neither full name nor age/DOB is collected. Age is not cosmetic:

- **Safety.** Age gates load progression, max-HR estimates, and whether to surface
  high-impact/plyometric work at all. Recommending box jumps to a 68-year-old
  beginner is the kind of thing that ends a fitness app.
- **Legal.** Under-16s need parental consent under GDPR Art. 8 (as low as 13
  depending on member state). Without an age gate you cannot know whether you are
  lawfully processing a minor's health data.

**Proposal:** add a Step 0 "About you" — display name (free text) and date of birth
(date picker, not free text). Store `dateOfBirth` and derive age at read time; storing
a computed `age` goes stale and is worse data-minimisation.

Hard gate: if derived age < 16, block completion and show a "not available for under
16s" screen. Cheaper than any alternative and removes the Art. 8 problem entirely.

### G2 — Health data is collected with no consent basis
`injuryFlags[]` is **special-category health data under GDPR Art. 9**. Art. 9 processing
is prohibited by default; the workable exemption here is **explicit consent** (Art. 9(2)(a)).
Today the app collects it with no consent capture, no disclosure, and no policy to point at.

**Proposal — a consent step, placed *before* the Bio step:**

- Health disclaimer ("not medical advice, consult a physician…") — **required**,
  explicit tick, not a pre-checked box, not implied by pressing Next.
- Privacy policy + ToS acceptance — **required**, links must resolve.
- Marketing/product emails — **optional**, separate toggle, default off.

Write a consent record, never a bare boolean:

```
users/{uid}/consents/current
  healthDataProcessing: { granted: bool, version: 'v1', grantedAt: Timestamp }
  privacyPolicy:        { granted: bool, version: 'v1', grantedAt: Timestamp }
  marketing:            { granted: bool, version: 'v1', grantedAt: Timestamp }
```

Versioning matters: when the policy changes you must be able to prove *which* version
each user accepted and re-prompt only those on an older one. A boolean can't do that.

**Blocking rule:** if health consent is declined, skip the injury step and proceed
without it. Do not block the app on it — declining a *health* consent must still leave
a usable product, or the consent isn't freely given and is therefore invalid.

### G3 — Account deletion is currently impossible
`firestore.rules` has `allow delete: if false` on `users/{uid}`. That is correct as a
client rule (users shouldn't nuke their own doc mid-session), but there is **no
server-side path either** — so GDPR Art. 17 erasure cannot be honoured at all today.
It is also a Google Play requirement for any app with accounts.

**Proposal:** a callable function `deleteAccount` that recursively deletes
`users/{uid}/**`, then the Auth user. Firestore has no cascading delete — subcollections
(`workouts`, `sets`, `plans`, `metrics`, `entitlements`, `consents`) must each be walked,
which is exactly the kind of thing that gets forgotten and leaves orphaned PII.

Pair it with `exportMyData` (Art. 20 portability) — same traversal, returns JSON.
Cheap to add once the traversal exists.

### G4 — No premium surface in onboarding
Onboarding is the highest-intent moment in the product and currently ends with a
silent redirect home.

**Proposal:** a final non-blocking "Your plan is ready" step that reflects the user's
*own* answers back at them ("3 days/week, hypertrophy, dumbbells only") and offers
Premium as the way to unlock more. Dismissible with a visible "Continue free" of equal
visual weight — a dark-patterned upsell on a health app buys one conversion and loses
the review score.

Per your decision: **Premium upsell only. No affiliate targeting from health data.**
Age, injuries, and goals must never be used to select third-party offers. This keeps
you out of GDPR profiling-consent obligations entirely, and is the reason no
affiliate consent flag appears in the schema above.

### G5 — PII segregation
Today everything lives flat in `users/{uid}`, which the owner can read and write.

Minimum viable hardening (no new infrastructure, $0):
- Keep identity + health fields in `users/{uid}` but add rules **validating** them on
  write — `dateOfBirth` immutable once set, `injuryFlags` must be a list of known ids.
  The existing rules validate `customExercises` this way already; follow that pattern.
- Never log PII. `auth.ts:13` currently logs `user.email` into Cloud Logging on every
  signup — that puts email in a 30-day retained log with a different access model than
  Firestore. **Log the uid only.** Small change, real exposure.

## Bugs found while reading (independent of this spec)

1. **`handleSkip` writes `onboardingCompleted: false`** (line 115), so a user who skips
   is shown the wizard again on every launch — `RootNavigator` gates on that flag. If
   resumable-by-design, it needs a separate `onboardingSkippedAt` so it can be shown
   once more, not forever.
2. **Template matching is fragile** (line 140):
   `templates.find(t => t.id.toLowerCase().includes(formData.goal))`. Goal ids are
   `fat_loss`/`hypertrophy`; if template ids use `fatloss` or `fat-loss` this silently
   falls through to `templates[0]` and the user gets a plan unrelated to their goal —
   with no error. Should be an explicit goal→template map with a logged fallback.

## Suggested order

1. G3 (deletion/export) — hard blocker for real users and for Play.
2. G2 (consent) — must exist before more health data is collected.
3. G1 (age gate) — depends on G2's consent screen being in place.
4. G5 (PII hygiene) — the email-logging fix is a 1-line change, do it immediately.
5. G4 (upsell) — last; it's the only revenue item but the least risky to defer.

Bugs 1–2 are unrelated to compliance and can go anytime.

## Acceptance criteria

- Under-16 DOB cannot complete onboarding.
- Declining health consent yields a working app with no injury data stored.
- `users/{uid}/consents/current` carries a version and timestamp per consent.
- `deleteAccount` leaves zero documents under `users/{uid}` — asserted by a rules/
  integration test that seeds every subcollection first.
- No PII in Cloud Logging.
- Existing 97 app tests and 36 functions tests stay green.
