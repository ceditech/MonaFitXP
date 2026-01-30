# Security Rules - Notification Preferences (Epic 0.7)

## Current Rules

```javascript
match /users/{userId} {
  allow read, write: if request.auth.uid == userId;
}
```

## Updated Rules

**No changes required** for basic functionality. The `notificationPrefs` field is part of the user document and inherits existing read/write permissions.

## Optional: Field Validation

For production deployments, consider adding validation to ensure data integrity:

```javascript
match /users/{userId} {
  allow read: if request.auth.uid == userId;
  
  allow write: if request.auth.uid == userId && validUserUpdate();
  
  function validUserUpdate() {
    let data = request.resource.data;
    
    // If notificationPrefs is present, validate structure
    return !data.keys().hasAny(['notificationPrefs']) ||
      validNotificationPrefs(data.notificationPrefs);
  }
  
  function validNotificationPrefs(prefs) {
    return prefs == null || (
      prefs.keys().hasAll(['remindersEnabled', 'reminderTime', 'reminderDays']) &&
      prefs.remindersEnabled is bool &&
      prefs.reminderTime is string &&
      prefs.reminderTime.matches('^([0-1][0-9]|2[0-3]):[0-5][0-9]$') && // HH:mm format
      prefs.reminderDays is list &&
      prefs.reminderDays.size() <= 7 &&
      prefs.reminderDays.hasOnly(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'])
    );
  }
}
```

## Guest User Considerations

- Guest users (with valid `uid` from session) can read/write their own preferences
- Preferences are stored locally in AsyncStorage for mock implementation
- Future Firestore migration will use the same permission model

## Notes

- **Mock Implementation**: Current implementation uses AsyncStorage, so Firestore rules are not enforced yet
- **Future Enhancement**: When migrating to Firestore, apply the optional validation rules above
- **Privacy**: Notification preferences are user-specific and not shared across users
