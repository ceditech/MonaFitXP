# Schema - Paywall Screen (Epic 0.8)

## UserProfile Extension (Future)

### Collection: `users/{uid}`

**Field Addition** (deferred to payment integration epic):
```typescript
subscription?: {
  tier: 'free' | 'plus' | 'pro';
  status: 'active' | 'cancelled' | 'expired';
  expiresAt?: string; // ISO 8601 timestamp
  purchaseToken?: string; // For receipt validation
}
```

### Example Document

**CURRENT** (MVP):
```json
{
  "uid": "guest_abc123",
  "isGuest": true,
  "createdAt": "2026-01-29T10:00:00Z"
}
```

**FUTURE** (after payment integration):
```json
{
  "uid": "guest_abc123",
  "isGuest": false,
  "createdAt": "2026-01-29T10:00:00Z",
  "subscription": {
    "tier": "plus",
    "status": "active",
    "expiresAt": "2027-01-29T10:00:00Z",
    "purchaseToken": "GPA.1234-5678-9012-3456"
  }
}
```

## Entitlement Service (MVP Stub)

For MVP, entitlement logic is a simple stub:

```typescript
// app/src/services/EntitlementService.ts
export const getCurrentTier = (): 'free' | 'plus' | 'pro' => {
  // Always return 'free' for MVP
  return 'free';
};

export const hasAccess = (feature: string): boolean => {
  const tier = getCurrentTier();
  // Only free features accessible in MVP
  return tier === 'free' ? feature === 'basic' : true;
};
```

## Migration Notes

- **No migration required**: Subscription field is optional and will be added when payment integration is implemented
- **Backward compatibility**: Existing users without `subscription` field will default to `free` tier
- **Default values**: 
  - `tier`: `'free'`
  - `status`: `'active'`
