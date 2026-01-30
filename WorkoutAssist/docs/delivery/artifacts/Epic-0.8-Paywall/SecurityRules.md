# Security Rules - Paywall Screen (Epic 0.8)

## Current Rules

```javascript
match /users/{userId} {
  allow read, write: if request.auth.uid == userId;
}
```

## Updated Rules (Future)

**No changes required for MVP**. The PaywallScreen only displays pricing information and does not write any subscription data.

When payment integration is added and the `subscription` field is introduced, update rules as follows:

```javascript
match /users/{userId} {
  allow read: if request.auth.uid == userId;
  
  allow write: if request.auth.uid == userId && validUserUpdate();
  
  function validUserUpdate() {
    // Prevent client-side updates to subscription field
    // Only server-side (Cloud Functions) can update subscription
    return !request.resource.data.diff(resource.data).affectedKeys().hasAny(['subscription']);
  }
}
```

## Rationale

- **Client Read-Only**: Users can read their own subscription status
- **Server Write-Only**: Only backend (via Cloud Functions triggered by payment webhooks) can update subscription status
- **Prevents Fraud**: Users cannot manually upgrade themselves by modifying Firestore

## Notes

- **MVP**: Current implementation uses a stub service that always returns `'free'` tier
- **Future**: Payment integration will use Cloud Functions to validate receipts and update subscription status
- **Guest Users**: Guest users will always have `'free'` tier until they create an account and purchase
