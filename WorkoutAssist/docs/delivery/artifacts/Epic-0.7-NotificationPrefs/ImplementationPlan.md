# Implementation Plan - Notification Preferences (Epic 0.7)

## Overview
Build `NotificationPrefsScreen` to allow users to configure workout reminder preferences. Preferences are stored in the user profile via `MockWorkoutRepository` and will persist across sessions using AsyncStorage.

## User Review Required

> [!IMPORTANT]
> **Repository Method Addition**: This implementation requires adding `getUserProfile` and `saveUserProfile` methods to `IWorkoutRepository` and `MockWorkoutRepository`. These methods will be used by future features beyond notification preferences.

> [!NOTE]
> **No Push Notifications**: This epic only implements preference storage. Actual push notification scheduling is deferred to a future epic.

## Proposed Changes

### Repository Layer

#### [MODIFY] [IWorkoutRepository.ts](file:///d:/DESKTOP-AAG9AO3/Program-App/sources/repos/SaaS-App/MonaFitXP/WorkoutAssist/app/src/data/contracts/IWorkoutRepository.ts)

**Add methods**:
```typescript
getUserProfile(uid: string): Promise<UserProfile | null>;
saveUserProfile(uid: string, profile: Partial<UserProfile>): Promise<void>;
```

**Extend UserProfile interface**:
```typescript
export interface UserProfile {
  // ... existing fields
  notificationPrefs?: {
    remindersEnabled: boolean;
    reminderTime: string; // "HH:mm"
    reminderDays: string[]; // ["Mon", "Tue", ...]
  };
  updatedAt?: string;
}
```

---

#### [MODIFY] [MockWorkoutRepository.ts](file:///d:/DESKTOP-AAG9AO3/Program-App/sources/repos/SaaS-App/MonaFitXP/WorkoutAssist/app/src/data/workouts/MockWorkoutRepository.ts)

**Implement getUserProfile**:
- Read from AsyncStorage key: `workout_data_${uid}_profile`
- Use memCache for performance
- Return null if not found

**Implement saveUserProfile**:
- Merge updates with existing profile
- Set `updatedAt` timestamp
- Write to AsyncStorage and memCache

---

### UI Layer

#### [MODIFY] [NotificationPrefsScreen.tsx](file:///d:/DESKTOP-AAG9AO3/Program-App/sources/repos/SaaS-App/MonaFitXP/WorkoutAssist/app/src/features/home/NotificationPrefsScreen.tsx)

Replace placeholder with full implementation:

**State Management**:
- `remindersEnabled`: boolean
- `reminderTime`: string ("09:00")
- `reminderDays`: string[] (["Mon", "Wed", "Fri"])
- `loading`, `saving`, `error`, `showToast`

**UI Components**:
1. Toggle switch for enabling/disabling reminders
2. Time input (TextInput with HH:mm format)
3. Horizontal ScrollView with day chips (Mon-Sun)
4. Save button with loading state
5. Toast message on success

**Analytics Events**:
- `notif_prefs_viewed` (on mount)
- `notif_toggle_changed` (on toggle)
- `notif_time_changed` (on time edit)
- `notif_days_changed` (on day selection)
- `notif_prefs_saved` (on save)

---

#### [MODIFY] [SettingsScreen.tsx](file:///d:/DESKTOP-AAG9AO3/Program-App/sources/repos/SaaS-App/MonaFitXP/WorkoutAssist/app/src/features/home/SettingsScreen.tsx)

Add navigation row:
```typescript
<TouchableOpacity
  style={styles.settingRow}
  onPress={() => navigation.navigate('NotificationPrefs')}
>
  <Text style={styles.settingLabel}>Notifications</Text>
  <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.3)" />
</TouchableOpacity>
```

## Verification Plan

### Automated Tests
- Unit tests for repository methods (deferred)
- Integration tests for form logic (deferred)

### Manual Verification
1. Navigate from Settings → NotificationPrefs
2. Verify loading state appears briefly
3. Toggle reminders on → verify time picker and day chips appear
4. Select multiple days → verify chip styling updates
5. Change time → verify state updates
6. Tap Save → verify toast appears
7. Navigate back and return → verify preferences persist
8. Check console for all 5 analytics events
