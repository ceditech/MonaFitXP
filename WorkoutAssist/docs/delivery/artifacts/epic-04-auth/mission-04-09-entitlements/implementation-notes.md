# Implementation Notes - Entitlements

## Entitlement Model
Standardized typing for `plan` ('FREE' | 'PRO') and `status` ('active' | 'inactive' | 'trialing' | 'past_due').

## Data Path
The source of truth for entitlements is:
`users/{uid}/entitlements/current`

## Race Condition Handling
The `EntitlementProvider` includes a 3-second fallback timer. If the Firestore document is not found within this window (common immediately after signup before the trigger function finishes), the app falls back to the `FREE` plan to avoid blocking the user. The listener remains active and will update the UI as soon as the document is created.

## Security
Firestore rules explicitly split `read` into `get` (allowed for owner) and `list` (denied). Writing to entitlements is completely denied for the client.
