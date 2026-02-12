# Mission 04-09: Entitlements-aware App Shell

This mission implements plan-based gating (Free vs Pro) in the WorkoutAssist React Native application.

## Overview
- **Reactive Entitlements**: Using Firestore `onSnapshot` to listen to plan changes in real-time.
- **UI Gating**: `RequirePro` guard component to protect premium features.
- **Security**: Updated Firestore rules to ensure entitlements can only be managed by the server.

## Key Components
- `EntitlementProvider`: React Context providing entitlement state.
- `useEntitlement`: Hook for accessing plan data.
- `RequirePro`: Wrapper for Pro-only UI/Routes.

## Deployment
- Cloud Functions (ensureEntitlementDoc) must be active to create initial records.
- Firestore Security Rules must be deployed to `firestore.rules`.
