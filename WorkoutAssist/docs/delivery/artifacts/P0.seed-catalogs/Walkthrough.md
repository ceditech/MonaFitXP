# Walkthrough - Seed Firestore Catalogs

## Changes Made
*   Created `scripts/seed-firestore.js`: Admin SDK seeding script
*   Created repo root `package.json`: Added firebase-admin dependency

## Setup Instructions

### 1. Install Dependencies
```bash
cd d:\DESKTOP-AAG9AO3\Program-App\sources\repos\SaaS-App\MonaFitXP\WorkoutAssist
npm install
```

### 2. Download Service Account Key
1.  Go to [Firebase Console](https://console.firebase.google.com/)
2.  Select your project (`workoutassist-6e273`)
3.  Navigate to **Project Settings** → **Service Accounts**
4.  Click **Generate New Private Key**
5.  Save the JSON file to `D:\DESKTOP-AAG9AO3\Program-App\sources\repos\SaaS-App\MonaFitXP\WorkoutAssist\secrets\serviceAccountKey.json`

### 3. Set Environment Variable
**PowerShell**:
```powershell
$env:GOOGLE_APPLICATION_CREDENTIALS="D:\DESKTOP-AAG9AO3\Program-App\sources\repos\SaaS-App\MonaFitXP\WorkoutAssist\secrets\serviceAccountKey.json"
```

**CMD**:
```cmd
set GOOGLE_APPLICATION_CREDENTIALS=D:\DESKTOP-AAG9AO3\Program-App\sources\repos\SaaS-App\MonaFitXP\WorkoutAssist\secrets\serviceAccountKey.json
```

### 4. Run Seed Script
```bash
node scripts/seed-firestore.js
```

**OR** use the npm script:
```bash
npm run seed
```

## Verification Results
*   [x] Dependencies installed (firebase-admin)
*   [x] Script created and ready to run
*   [ ] Script executed successfully (User action required)
*   [ ] Console shows correct counts (20 exercises, 4 templates)
*   [ ] Firebase Console shows populated collections

## Safety Notes & Rollback

### Idempotency
The script uses `set()` with `merge: true`, making it safe to re-run. Re-running will update existing documents without creating duplicates.

### Rollback
If you need to remove seeded data:

**Option 1: Firebase Console**
1.  Navigate to Firestore Database
2.  Select the collection (`exerciseCatalog` or `planTemplates`)
3.  Delete all documents manually

**Option 2: Script** (create a separate cleanup script if needed)
```javascript
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.applicationDefault() });
const db = admin.firestore();

async function cleanup() {
  const batch = db.batch();
  const exercises = await db.collection('exerciseCatalog').get();
  exercises.forEach(doc => batch.delete(doc.ref));
  await batch.commit();
  console.log('Cleaned up exerciseCatalog');
}
```

### Security Reminder
> [!CAUTION]
> **NEVER commit the service account key file to version control.** It is already excluded via `.gitignore`.
