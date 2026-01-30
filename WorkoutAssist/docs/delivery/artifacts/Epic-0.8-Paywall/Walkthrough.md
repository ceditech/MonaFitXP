# Walkthrough - Paywall Screen (Epic 0.8)

## Overview
Implementation of `PaywallScreen` to display premium upgrade options with 3 pricing tiers (Free, Plus, Pro). Includes placeholder CTAs for future payment integration.

## Key Accomplishments
- [x] Updated `Routes.ts` to add route params for Paywall
- [x] Implemented `PaywallScreen.tsx` with pricing cards
- [x] Created Free tier card with "Current Plan" badge
- [x] Created Plus tier card with "Recommended" badge
- [x] Created Pro tier card
- [x] Implemented placeholder upgrade CTAs with toast feedback
- [x] Added "Not now" dismiss button
- [x] Implemented 3 analytics events

## Implementation Details

### Route Params
Updated `Routes.ts` (line 36) to support:
- `source`: Analytics tracking (e.g., "plan_templates", "settings")
- `templateId`: If gated by premium template
- `returnTo`: Optional return route after upgrade

### UI Components
**PricingCard Component**: Reusable card component with props for tier, price, badge, benefits, and upgrade CTA.

**PaywallScreen**: Main screen component with:
- Header with conditional subtitle (shown when `templateId` is present)
- 3 pricing cards in vertical stack
- "Not now" footer button
- Toast notification for placeholder upgrade feedback

### Pricing Tiers

**Free** (Current):
- $0/month
- 3 workout templates
- Basic exercise catalog
- Workout history

**Plus** (Recommended):
- $9.99/month
- All Free features
- 20+ premium templates
- Advanced analytics
- Custom workout builder
- Priority support

**Pro**:
- $19.99/month
- All Plus features
- Unlimited templates
- AI-powered recommendations
- Nutrition tracking
- 1-on-1 coaching

### Analytics Events
1. `paywall_viewed` - Screen mount (with source param)
2. `upgrade_clicked` - Upgrade button tap (with tier: 'plus' | 'pro')
3. `paywall_dismissed` - "Not now" tap (with source)

## Evidence
> **Note**: Manual verification required.

**Manual Testing Steps**:
1. Navigate to Paywall (e.g., from Settings or premium template)
2. Verify all 3 pricing tiers display
3. Verify "Recommended" badge on Plus tier
4. Tap "Upgrade to Plus" → verify toast appears
5. Tap "Upgrade to Pro" → verify toast appears
6. Tap "Not now" → verify navigation back
7. Check console for analytics events

## Verification Results
- [ ] **Navigation**: Manual verification required
- [ ] **Pricing Display**: Manual verification required
- [ ] **CTA Behavior**: Manual verification required
- [ ] **Dismiss Flow**: Manual verification required
- [ ] **Analytics**: Manual verification required (check console logs)
