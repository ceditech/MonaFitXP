#!/usr/bin/env node

/**
 * Firestore Catalog Seeding Script
 * 
 * Seeds exerciseCatalog and planTemplates collections from fixture files.
 * Uses firebase-admin SDK with service account credentials.
 * 
 * Usage:
 *   1. Set GOOGLE_APPLICATION_CREDENTIALS env var to service account key path
 *   2. Run: node scripts/seed-firestore.js
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin SDK
try {
    admin.initializeApp({
        credential: admin.credential.applicationDefault()
    });
    console.log('✓ Firebase Admin SDK initialized');
} catch (error) {
    console.error('✗ Failed to initialize Firebase Admin SDK');
    console.error('  Make sure GOOGLE_APPLICATION_CREDENTIALS is set to your service account key path');
    console.error('  Error:', error.message);
    process.exit(1);
}

const db = admin.firestore();

// Fixture file paths
const FIXTURES_DIR = path.join(__dirname, '..', 'app', 'src', 'data', 'mocks');
const EXERCISE_CATALOG_PATH = path.join(FIXTURES_DIR, 'exerciseCatalog.json');
const PLAN_TEMPLATES_PATH = path.join(FIXTURES_DIR, 'planTemplates.json');

// Batch write limit (Firestore max is 500, we use 450 for safety)
const BATCH_SIZE = 450;

/**
 * Read and parse JSON fixture file
 */
function readFixture(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(content);
    } catch (error) {
        console.error(`✗ Failed to read fixture: ${filePath}`);
        console.error('  Error:', error.message);
        process.exit(1);
    }
}

/**
 * Validate that all items have required ID field
 */
function validateIds(items, idField, collectionName) {
    const missing = items.filter(item => !item[idField]);
    if (missing.length > 0) {
        console.error(`✗ Validation failed for ${collectionName}`);
        console.error(`  ${missing.length} items missing '${idField}' field`);
        process.exit(1);
    }
    console.log(`✓ Validated ${items.length} items in ${collectionName}`);
}

/**
 * Seed a collection using batch writes
 */
async function seedCollection(collectionName, items, idField) {
    console.log(`\nSeeding ${collectionName}...`);

    let written = 0;
    let skipped = 0;
    let errors = 0;

    // Process in batches
    for (let i = 0; i < items.length; i += BATCH_SIZE) {
        const batch = db.batch();
        const chunk = items.slice(i, i + BATCH_SIZE);

        for (const item of chunk) {
            const docId = item[idField];
            const docRef = db.collection(collectionName).doc(docId);

            try {
                // Use set with merge to make it idempotent
                batch.set(docRef, item, { merge: true });
                written++;
            } catch (error) {
                console.error(`  ✗ Error preparing doc ${docId}:`, error.message);
                errors++;
            }
        }

        try {
            await batch.commit();
            console.log(`  ✓ Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${chunk.length} documents`);
        } catch (error) {
            console.error(`  ✗ Batch commit failed:`, error.message);
            errors += chunk.length;
            written -= chunk.length;
        }
    }

    return { written, skipped, errors };
}

/**
 * Main seeding function
 */
async function main() {
    console.log('='.repeat(60));
    console.log('Firestore Catalog Seeding Script');
    console.log('='.repeat(60));

    try {
        // Read fixtures
        console.log('\nReading fixture files...');
        const exercises = readFixture(EXERCISE_CATALOG_PATH);
        const planTemplates = readFixture(PLAN_TEMPLATES_PATH);
        console.log(`✓ Loaded ${exercises.length} exercises`);
        console.log(`✓ Loaded ${planTemplates.length} plan templates`);

        // Validate IDs
        console.log('\nValidating data...');
        validateIds(exercises, 'id', 'exerciseCatalog');
        validateIds(planTemplates, 'id', 'planTemplates');

        // Seed collections
        const exerciseResults = await seedCollection('exerciseCatalog', exercises, 'id');
        const templateResults = await seedCollection('planTemplates', planTemplates, 'id');

        // Print summary
        console.log('\n' + '='.repeat(60));
        console.log('SEEDING SUMMARY');
        console.log('='.repeat(60));
        console.log('\nexerciseCatalog:');
        console.log(`  Written: ${exerciseResults.written}`);
        console.log(`  Errors:  ${exerciseResults.errors}`);
        console.log('\nplanTemplates:');
        console.log(`  Written: ${templateResults.written}`);
        console.log(`  Errors:  ${templateResults.errors}`);
        console.log('\n' + '='.repeat(60));

        const totalErrors = exerciseResults.errors + templateResults.errors;
        if (totalErrors > 0) {
            console.log(`\n⚠ Completed with ${totalErrors} errors`);
            process.exit(1);
        } else {
            console.log('\n✓ Seeding completed successfully!');
            process.exit(0);
        }

    } catch (error) {
        console.error('\n✗ Seeding failed:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

// Run the script
main();
