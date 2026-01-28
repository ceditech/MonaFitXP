# EPIC ARTIFACT TEMPLATE

## Naming Convention
- **Artifact ID**: `ART-[EpicID]-[Seq]` (e.g., `ART-P0.1-01` for Auth Flow)
- **Evidence ID**: `EV-[EpicID]-[Seq]` (e.g., `EV-P0.1-01` for Sign-In Video)
- **Decision ID**: `DEC-[Seq]` (Global sequence)

## Artifact 1 — UI Flow Map
*Visual or text-based description of screens and navigation.*
- [ ] **Happy Path**: Step-by-step user journey.
- [ ] **Error States**: Network failure, input errors.
- [ ] **Loading States**: Skeletons or spinners?

## Artifact 2 — Firestore Schema Diff
*JSON-like structure showing collection/doc changes.*
- [ ] **Collections**: New or modified.
- [ ] **Fields**: Types (string, number, map) and constraints.
- [ ] **Indexes**: Composite indexes required?
- [ ] **Cost Impact**: Read/write frequency estimation.

## Artifact 3 — Security Rules Diff
*Proposed `firestore.rules` and `storage.rules` changes.*
- [ ] **Scope**: Specific paths affected.
- [ ] **Logic**: Conditions (e.g., `request.auth != null`).
- [ ] **Validation**: Data validation rules (e.g., `request.resource.data.score > 0`).

## Artifact 4 — Implementation Plan (React Native)
*Technical approach for the client side.*
- [ ] **Components**: New or reused.
- [ ] **State Management**: Local state vs Global Store (Zustand/Context).
- [ ] **Libraries**: Any new dependencies?
- [ ] **Offline**: Behavior when disconnected.

## Artifact 5 — Cloud Functions Plan (if applicable)
*Backend logic triggers and endpoints.*
- [ ] **Trigger**: HTTP, Firestore Trigger, Schedule?
- [ ] **Logic**: What does it do?
- [ ] **Idempotency**: Handling retries safely.

## Artifact 6 — Analytics Events
*Tracking user actions.*
- [ ] **Events**: Event names and parameters.
- [ ] **Purpose**: KPIs driving this tracking.

## Artifact 7 — Test Checklist
*How will this be verified?*
- [ ] **Unit Tests**: Logic to cover.
- [ ] **Integration Tests**: Flows to cover.
- [ ] **Manual Device Tests**: Specific devices/OS versions.

## Artifact 8 — Evidence Checklist
*Proof of work required for "Ready for Review".*
- [ ] **Screenshots**: UI states.
- [ ] **Recordings**: Complex flows.
- [ ] **Logs**: Console output or Firestore Admin view (for backend logic).

## Acceptance Criteria
- [ ] Meets all constraints in standard Epic definition.
- [ ] Passes accessibility check (minimum touch targets, contrast).
- [ ] No regression in startup time.

## Security Rules Self-Audit
- [ ] **Default Deny**: Is the top-level rule `match /{document=**} { allow read, write: if false; }`?
- [ ] **Isolation**: Are user records strictly `allow ... if request.auth.uid == userId`?
- [ ] **Admin Write**: Are global catalogs `allow write: if false` (or admin check)?
- [ ] **Entitlements**: Are premium features verified on server/rules, not just client UI?

## Performance Self-Audit
- [ ] **No Heavy Reads**: Avoid `collectionGroup` queries without strict filters.
- [ ] **Summaries**: Using counters/aggregates instead of `count()` on large collections?
- [ ] **Pagination**: using `limit()` on list views?
