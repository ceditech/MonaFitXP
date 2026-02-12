# QA Checklist: Entitlements-aware App Shell

- [ ] **Initial Creation**:
    - Create a new user account.
    - Check Firestore: `users/{uid}/entitlements/current` should exist with `tier: "free"`.
- [ ] **Gating (Free)**:
    - Log in with the new account.
    - Attempt to navigate to "AI Coach".
    - Verify: Redirected to Upgrade screen with reason "Pro Required".
- [ ] **Gating (Pro)**:
    - Manually edit the Firestore document: Set `plan: "PRO"` and `status: "active"`.
    - Observe App: AI Coach should be accessible without restart (reactive update).
- [ ] **Security**:
    - Attempt a client-side update to the entitlement doc.
    - Verify: `FirebaseError: [code=permission-denied]` in logs.
- [ ] **Fallback**:
    - Temporarily disable the internet connection and login.
    - Verify: App shows "FREE" plan features after the 3s timeout.
