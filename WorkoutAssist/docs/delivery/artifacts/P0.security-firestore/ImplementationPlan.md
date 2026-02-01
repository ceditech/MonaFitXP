# Implementation Plan - Firestore Security Rules (P0.Security)

## User Review Required
> [!IMPORTANT]
> This plan establishes a "Default Deny" security posture. All access requires authentication.
> **Admin Access**: Write access to global catalogs (`exerciseCatalog`, `planTemplates`) requires a Custom Claim `admin: true` on the Firebase Auth token. You must set this claim via the Firebase Admin SDK or a Cloud Function for your admin users.

## Proposed Changes

### Security Rules
#### [NEW] [firestore.rules](file:///d:/DESKTOP-AAG9AO3/Program-App/sources/repos/SaaS-App/MonaFitXP/WorkoutAssist/firestore.rules)
- **Version**: 2
- **Default Policy**: Deny all.
- **Helpers**: `isSignedIn`, `isOwner`, `isAdmin`.
- **Global Collections**: `exerciseCatalog`, `planTemplates` (Auth Read, Admin Write).
- **User Data**: `users/{uid}` (Owner R/W, Delete Denied).
    - `plans`, `workouts`, `sets` (Owner R/W).
    - `metrics`, `entitlements` (Owner Read, Server Write).

### Configuration
#### [NEW] [firebase.json](file:///d:/DESKTOP-AAG9AO3/Program-App/sources/repos/SaaS-App/MonaFitXP/WorkoutAssist/firebase.json)
- Configures Firestore service to use `firestore.rules` and `firestore.indexes.json`.

#### [NEW] [firestore.indexes.json](file:///d:/DESKTOP-AAG9AO3/Program-App/sources/repos/SaaS-App/MonaFitXP/WorkoutAssist/firestore.indexes.json)
- Empty default index configuration.

## Verification Plan

### Manual Verification
1.  **Deployment**: User must run `firebase deploy --only firestore` (see Runbook).
2.  **Rules Playground**: Use the Firebase Console "Rules Playground" to simulate:
    - **Positive Test**: Authenticated user reading `exerciseCatalog` -> ALLOW.
    - **Positive Test**: Owner writing to `users/{uid}/workouts/w1` -> ALLOW.
    - **Negative Test**: Unauthenticated user reading `exerciseCatalog` -> DENY.
    - **Negative Test**: User A reading User B's workout -> DENY.
    - **Negative Test**: User writing to `entitlements` -> DENY.

### Automated Tests
*   (Out of scope for this task: Requires setting up `@firebase/rules-unit-testing` emulator suite).
