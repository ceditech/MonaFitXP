import AsyncStorage from '@react-native-async-storage/async-storage';
import { MockWorkoutRepository } from '../MockWorkoutRepository';

const UID = 'test-user';

describe('MockWorkoutRepository — custom exercises & favorites', () => {
    let repo: MockWorkoutRepository;

    beforeEach(async () => {
        await AsyncStorage.clear();
        repo = new MockWorkoutRepository();
    });

    describe('custom exercises', () => {
        it('creates a custom exercise with a custom_ prefixed id', async () => {
            const id = await repo.createCustomExercise(UID, {
                name: 'Landmine Press',
                muscles: ['Shoulders'],
                type: 'weight',
                equipment: ['barbell'],
            });
            expect(id).toMatch(/^custom_/);

            const list = await repo.listCustomExercises(UID);
            expect(list).toHaveLength(1);
            expect(list[0]).toMatchObject({
                id,
                name: 'Landmine Press',
                isCustom: true,
                ownerUid: UID,
            });
        });

        it('merges catalog and custom exercises without id collisions', async () => {
            await repo.createCustomExercise(UID, {
                name: 'My Move', muscles: ['Core'], type: 'bodyweight', equipment: ['none'],
            });
            const catalog = await repo.getExercises();
            const merged = await repo.getMergedExercises(UID);

            expect(merged).toHaveLength(catalog.length + 1);
            expect(new Set(merged.map(e => e.id)).size).toBe(merged.length);
            expect(merged.filter(e => e.isCustom)).toHaveLength(1);
        });

        it('deletes a custom exercise', async () => {
            const id = await repo.createCustomExercise(UID, {
                name: 'Temp', muscles: ['Back'], type: 'weight', equipment: ['cable'],
            });
            await repo.deleteCustomExercise(UID, id);
            expect(await repo.listCustomExercises(UID)).toHaveLength(0);
        });

        it('isolates custom exercises per user', async () => {
            await repo.createCustomExercise(UID, {
                name: 'Mine', muscles: ['Chest'], type: 'weight', equipment: ['dumbbell'],
            });
            expect(await repo.listCustomExercises('other-user')).toHaveLength(0);
        });
    });

    describe('favorites', () => {
        it('starts empty and round-trips a toggle', async () => {
            expect(await repo.getFavoriteExerciseIds(UID)).toEqual([]);

            const afterAdd = await repo.toggleFavorite(UID, 'ex_001');
            expect(afterAdd).toEqual(['ex_001']);
            expect(await repo.getFavoriteExerciseIds(UID)).toEqual(['ex_001']);

            const afterRemove = await repo.toggleFavorite(UID, 'ex_001');
            expect(afterRemove).toEqual([]);
        });

        it('supports multiple favorites incl. custom ids', async () => {
            await repo.toggleFavorite(UID, 'ex_001');
            await repo.toggleFavorite(UID, 'custom_abc');
            expect((await repo.getFavoriteExerciseIds(UID)).sort()).toEqual(['custom_abc', 'ex_001']);
        });
    });

    describe('catalog seeds', () => {
        it('every catalog exercise has a primaryMuscleGroup', async () => {
            const catalog = await repo.getExercises();
            expect(catalog.length).toBeGreaterThan(0);
            for (const ex of catalog) {
                expect(typeof ex.primaryMuscleGroup).toBe('string');
                expect(ex.primaryMuscleGroup!.length).toBeGreaterThan(0);
            }
        });
    });
});
