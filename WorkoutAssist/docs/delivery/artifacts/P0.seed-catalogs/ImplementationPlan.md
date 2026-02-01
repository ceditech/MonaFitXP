# Implementation Plan - Seed Firestore Catalogs (P0.SEED)

## User Review Required
> [!IMPORTANT]
> **Service Account Key Required**: You must download a service account JSON key from Firebase Console and set the `GOOGLE_APPLICATION_CREDENTIALS` environment variable to its path before running the seed script.
> 
> **Security**: The service account key file must NEVER be committed to the repository. It is already excluded via `.gitignore`.

## Data Model Mapping

### exerciseCatalog Collection
**Source**: `app/src/data/mocks/exerciseCatalog.json`
- **Document ID**: `exercise.id` (e.g., `ex_001`)
- **Fields**: All fields from JSON (id, name, muscles, type, equipment, difficulty, instructions)
- **Count**: 20 exercises

### planTemplates Collection
**Source**: `app/src/data/mocks/planTemplates.json`
- **Document ID**: `template.id` (e.g., `tpl_001`)
- **Fields**: All fields from JSON (id, name, difficulty, daysPerWeek, isPremium, shortDescription, equipment, blocks)
- **Count**: 4 templates

## Proposed Changes

### Seed Script
#### [NEW] [scripts/seed-firestore.js](file:///d:/DESKTOP-AAG9AO3/Program-App/sources/repos/SaaS-App/MonaFitXP/WorkoutAssist/scripts/seed-firestore.js)
- Uses `firebase-admin` SDK with `applicationDefault()` credentials
- Reads fixture files from `app/src/data/mocks/`
- Validates that each document has required ID field
- Uses Firestore batch writes (max 450 per batch for safety)
- Upserts documents (idempotent - safe to re-run)
- Prints summary: counts written, skipped, errors

### Dependencies
#### [MODIFY] [package.json](file:///d:/DESKTOP-AAG9AO3/Program-App/sources/repos/SaaS-App/MonaFitXP/WorkoutAssist/package.json)
- Add `firebase-admin` as a dev dependency at repo root

### Security
#### [VERIFY] [.gitignore](file:///d:/DESKTOP-AAG9AO3/Program-App/sources/repos/SaaS-App/MonaFitXP/WorkoutAssist/.gitignore)
- Confirm `secrets/` and `**/serviceAccountKey*.json` are excluded (already done by user)

## Verification Plan

### Automated Tests
*   Run the seed script and verify console output shows correct counts

### Manual Verification
1.  **Firebase Console**: Navigate to Firestore Database
2.  **Check Collections**: Verify `exerciseCatalog` (20 docs) and `planTemplates` (4 docs) exist
3.  **Spot Check**: Open a few documents and verify fields match fixture data
4.  **Re-run Safety**: Run script again and verify it reports "0 written" (idempotent)
