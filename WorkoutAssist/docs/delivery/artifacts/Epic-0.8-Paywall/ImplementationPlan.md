# Implementation Plan - Paywall Screen (Epic 0.8)

## Overview
Build `PaywallScreen` as the premium upgrade gate, displaying 3 pricing tiers (Free, Plus, Pro) with placeholder upgrade CTAs. This screen will be used to gate premium features and templates.

## User Review Required

> [!NOTE]
> **Placeholder CTAs**: Upgrade buttons will show a "Coming soon!" toast message. Actual payment integration is deferred to a future epic.

> [!IMPORTANT]
> **Route Params Update**: The `Paywall` route in `Routes.ts` currently has `undefined` params. This needs to be updated to support `source`, `templateId`, and `returnTo` params for proper analytics and navigation.

## Proposed Changes

### Navigation Layer

#### [MODIFY] [Routes.ts](file:///d:/DESKTOP-AAG9AO3/Program-App/sources/repos/SaaS-App/MonaFitXP/WorkoutAssist/app/src/app/navigation/Routes.ts)

Update line 36 from:
```typescript
Paywall: undefined;
```

To:
```typescript
Paywall: { source?: string; templateId?: string; returnTo?: string };
```

---

### UI Layer

#### [MODIFY] [PaywallScreen.tsx](file:///d:/DESKTOP-AAG9AO3/Program-App/sources/repos/SaaS-App/MonaFitXP/WorkoutAssist/app/src/features/home/PaywallScreen.tsx)

Replace placeholder with full implementation:

**Route Params**:
- `source`: Analytics tracking (e.g., "plan_templates", "exercise_detail")
- `templateId`: If gated by premium template
- `returnTo`: Optional return route after upgrade

**UI Components**:
1. **Header**: "Upgrade to Premium" title
2. **Conditional Subtitle**: "This plan requires a premium subscription" (if `templateId` present)
3. **Pricing Cards** (3):
   - **Free**: Current plan, $0/month, 3 benefits
   - **Plus**: Recommended, $9.99/month, 5 benefits, "Upgrade to Plus" CTA
   - **Pro**: $19.99/month, 5 benefits, "Upgrade to Pro" CTA
4. **Footer**: "Not now" dismiss button
5. **Toast**: "Coming soon!" message on upgrade tap

**Analytics Events**:
- `paywall_viewed` (on mount, with source)
- `upgrade_clicked` (on CTA tap, with tier)
- `paywall_dismissed` (on "Not now" tap, with source)

---

### Optional: Entitlement Service

#### [NEW] [EntitlementService.ts](file:///d:/DESKTOP-AAG9AO3/Program-App/sources/repos/SaaS-App/MonaFitXP/WorkoutAssist/app/src/services/EntitlementService.ts)

Create a simple stub for future payment integration:

```typescript
export const getCurrentTier = (): 'free' | 'plus' | 'pro' => 'free';

export const hasAccess = (feature: string): boolean => {
  return feature === 'basic'; // Only free features for now
};
```

## Verification Plan

### Manual Verification
1. Navigate to Paywall (e.g., from Settings or premium template)
2. Verify all 3 pricing tiers display correctly
3. Verify "Recommended" badge on Plus tier
4. Tap "Upgrade to Plus" → verify toast appears
5. Tap "Upgrade to Pro" → verify toast appears
6. Tap "Not now" → verify navigation back
7. Check console for all 3 analytics events
