# Walkthrough - Firestore Security Rules

## Changes Made
*   Created `firestore.rules`: Implemented Default Deny + User Isolation.
*   Created `firebase.json`: Configured Firebase CLI for Firestore.
*   Created `firestore.indexes.json`: Initial index setup.

## Deployment Instructions
> [!IMPORTANT]
> Run these commands from the repo root: `d:\DESKTOP-AAG9AO3\Program-App\sources\repos\SaaS-App\MonaFitXP\WorkoutAssist`

1.  **Install Firebase CLI** (if not installed):
    ```bash
    npm install -g firebase-tools
    ```

2.  **Login to Firebase**:
    ```bash
    firebase login
    ```

3.  **Initialize Project** (First time only):
    *   Run `firebase use --add` and select your project (`workoutassist-6e273`).
    *   Alias it as `default`.

4.  **Deploy Rules**:
    ```bash
    firebase deploy --only firestore:rules
    ```

5.  **Deploy Indexes** (if needed later):
    ```bash
    firebase deploy --only firestore:indexes
    ```

## Verification Results
*   [x] Rules syntax is valid (Static check passed)
*   [ ] Rules deployed successfully (User action required)
