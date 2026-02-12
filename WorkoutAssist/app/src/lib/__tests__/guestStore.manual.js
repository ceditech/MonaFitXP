const GuestStore = require('../guestStore');
const uuid = require('uuid');

// Mock localStorage
const storage = {};
global.localStorage = {
    getItem: (key) => storage[key] || null,
    setItem: (key, value) => { storage[key] = value; },
    removeItem: (key) => { delete storage[key]; },
    clear: () => { Object.keys(storage).forEach(k => delete storage[k]); }
};

// Mock window
global.window = {};

function assert(condition, message) {
    if (!condition) {
        throw new Error(`Assertion failed: ${message}`);
    }
    console.log(`PASS: ${message}`);
}

async function runTests() {
    console.log('--- Starting GuestStore Tests (JS) ---');

    // 1. Guest ID
    const guestId1 = GuestStore.getOrCreateGuestId();
    assert(!!guestId1, 'Guest ID should be generated');
    const guestId2 = GuestStore.getOrCreateGuestId();
    assert(guestId1 === guestId2, 'Guest ID should be persistent');

    // 2. Upsert Workout
    const workout1 = {
        clientId: 'test-uuid-1',
        createdAtMs: Date.now(),
        updatedAtMs: Date.now(),
        payload: { name: 'Morning Run' }
    };
    GuestStore.upsertGuestWorkout(workout1);

    const workouts = GuestStore.readGuestWorkouts();
    assert(workouts.length === 1, 'Workout should be saved');
    assert(workouts[0].clientId === 'test-uuid-1', 'Correct clientId saved');
    assert(workouts[0].payload.name === 'Morning Run', 'Correct payload saved');

    // 3. Update Workout
    const workout1Updated = { ...workout1, payload: { name: 'Afternoon Run' } };
    GuestStore.upsertGuestWorkout(workout1Updated);
    const workoutsUpdated = GuestStore.readGuestWorkouts();
    assert(workoutsUpdated.length === 1, 'Still only 1 workout');
    assert(workoutsUpdated[0].payload.name === 'Afternoon Run', 'Payload updated');

    // 4. Migration State
    const initialState = GuestStore.getMigrationState();
    assert(initialState.status === 'idle', 'Initial state should be idle');

    GuestStore.setMigrationState({ status: 'complete' });
    const newState = GuestStore.getMigrationState();
    assert(newState.status === 'complete', 'Migration state should be updated');

    // 5. Remove Workout
    GuestStore.removeGuestWorkout('test-uuid-1');
    const workoutsAfterRemove = GuestStore.readGuestWorkouts();
    assert(workoutsAfterRemove.length === 0, 'Workout should be removed');

    // 6. Clear all
    GuestStore.upsertGuestWorkout(workout1);
    GuestStore.clearGuestWorkouts();
    assert(GuestStore.readGuestWorkouts().length === 0, 'All workouts should be cleared');

    console.log('--- All GuestStore Tests Passed ---');
}

runTests().catch(err => {
    console.error('Tests failed:', err);
    process.exit(1);
});
