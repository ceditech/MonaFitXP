# Schema - Notification Preferences (Epic 0.7)

## UserProfile Extension

### Collection: `users/{uid}`

**Field Addition**:
```typescript
notificationPrefs?: {
  remindersEnabled: boolean;
  reminderTime: string; // "HH:mm" format, e.g., "09:00"
  reminderDays: string[]; // Array of day names: ["Mon", "Tue", "Wed", ...]
}
updatedAt?: string; // ISO 8601 timestamp
```

### Example Document

**BEFORE** (new user):
```json
{
  "uid": "guest_abc123",
  "isGuest": true,
  "createdAt": "2026-01-29T10:00:00Z",
  "onboardingCompleted": true,
  "goal": "strength",
  "experience": "beginner"
}
```

**AFTER** (user saves notification preferences):
```json
{
  "uid": "guest_abc123",
  "isGuest": true,
  "createdAt": "2026-01-29T10:00:00Z",
  "onboardingCompleted": true,
  "goal": "strength",
  "experience": "beginner",
  "notificationPrefs": {
    "remindersEnabled": true,
    "reminderTime": "09:00",
    "reminderDays": ["Mon", "Wed", "Fri"]
  },
  "updatedAt": "2026-01-29T22:00:00Z"
}
```

## AsyncStorage (Mock Implementation)

### Key Format
```
workout_data_{uid}_profile
```

### Value Structure
Same as Firestore document structure above.

## Migration Notes

- **No migration required**: Field is optional and will be created on first save
- **Backward compatibility**: Existing users without `notificationPrefs` will see default state (reminders disabled)
- **Default values**: 
  - `remindersEnabled`: `false`
  - `reminderTime`: `"09:00"`
  - `reminderDays`: `[]`
