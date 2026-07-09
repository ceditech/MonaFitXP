import { buildShareCardData } from '../shareCard.types';
import { InProgressWorkout, GamificationState } from '../../../data/contracts/IWorkoutRepository';

const NOW = new Date('2026-07-08T12:00:00Z');

const workout: InProgressWorkout = {
    id: 'w1',
    name: 'Full Body Foundation',
    startedAt: '2026-07-08T10:00:00Z',
    status: 'completed',
    cursor: { exerciseIndex: 2, setIndex: 2 },
    sets: [
        { exerciseId: 'ex_001', setIndex: 0, targetReps: 10, actualWeight: 60, actualReps: 10, completedAt: '2026-07-08T10:05:00Z' },
        { exerciseId: 'ex_001', setIndex: 1, targetReps: 10, actualWeight: 100, actualReps: 8, completedAt: '2026-07-08T10:10:00Z' },
        { exerciseId: 'ex_002', setIndex: 0, targetReps: 10, actualWeight: 200, actualReps: 1 }, // NOT completed
    ],
};

const summary = { durationDisplay: '45:12', totalSets: 2, totalVolume: 1400 };

describe('buildShareCardData', () => {
    it('maps workout + summary into the card view model', () => {
        const data = buildShareCardData({ workout, summary, now: NOW });
        expect(data.workoutName).toBe('Full Body Foundation');
        expect(data.durationLabel).toBe('45:12');
        expect(data.totalSets).toBe(2);
        expect(data.totalVolume).toBe(1400);
    });

    it('picks the highest-volume COMPLETED set as best set', () => {
        const data = buildShareCardData({ workout, summary, now: NOW });
        // 100×8=800 beats 60×10=600; the 200×1 set is not completed → excluded
        expect(data.bestSetLabel).toBe('100kg × 8');
    });

    it('includes XP only when the award matches this workout', () => {
        const gamification: GamificationState = {
            totalXp: 1000, level: 5,
            lifetimeWorkouts: 10, lifetimeVolume: 5000, lifetimeSets: 80, lifetimePrs: 3,
            badges: {},
            lastAward: { workoutId: 'w1', xp: 230, breakdown: { base: 50, sets: 20, volume: 30, prs: 100, streak: 30 } },
        };
        expect(buildShareCardData({ workout, summary, gamification, now: NOW }).xpGained).toBe(230);

        const mismatched = { ...gamification, lastAward: { ...gamification.lastAward!, workoutId: 'other' } };
        expect(buildShareCardData({ workout, summary, gamification: mismatched, now: NOW }).xpGained).toBeNull();
    });

    it('degrades gracefully with no summary/gamification/sets', () => {
        const bare: InProgressWorkout = { ...workout, sets: [] };
        const data = buildShareCardData({ workout: bare, summary: null, now: NOW });
        expect(data.durationLabel).toBe('0:00');
        expect(data.totalSets).toBe(0);
        expect(data.bestSetLabel).toBeNull();
        expect(data.xpGained).toBeNull();
        expect(data.level).toBeNull();
        expect(data.streakDays).toBeNull();
    });

    it('formats the date label', () => {
        const data = buildShareCardData({ workout, summary, now: NOW });
        expect(data.dateLabel).toContain('2026');
    });
});
