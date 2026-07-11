import {
  dayKeyInTz,
  previousDayKey,
  computeStreakDays,
  computeVolumeHistory,
  computeWorkoutTotals,
  computeBestByExercise,
} from '../metricsCompute';

describe('dayKeyInTz', () => {
  it('formats a date as YYYY-MM-DD in UTC', () => {
    expect(dayKeyInTz(new Date('2026-01-02T12:00:00Z'), 'UTC')).toBe('2026-01-02');
  });

  it('buckets by the users timezone, not server UTC (the timezone bug)', () => {
    // 03:00 UTC on Jan 2 is still Jan 1 (22:00) in New York (UTC-5).
    const instant = new Date('2026-01-02T03:00:00Z');
    expect(dayKeyInTz(instant, 'UTC')).toBe('2026-01-02');
    expect(dayKeyInTz(instant, 'America/New_York')).toBe('2026-01-01');
  });

  it('handles the other side of the date line (Tokyo, UTC+9)', () => {
    // 22:00 UTC on Jan 1 is already Jan 2 (07:00) in Tokyo.
    const instant = new Date('2026-01-01T22:00:00Z');
    expect(dayKeyInTz(instant, 'Asia/Tokyo')).toBe('2026-01-02');
  });

  it('falls back to UTC for an invalid timezone instead of throwing', () => {
    const instant = new Date('2026-01-02T12:00:00Z');
    expect(dayKeyInTz(instant, 'Not/AZone')).toBe('2026-01-02');
  });
});

describe('previousDayKey', () => {
  it('returns the prior calendar day', () => {
    expect(previousDayKey('2026-01-05')).toBe('2026-01-04');
  });

  it('crosses month boundaries', () => {
    expect(previousDayKey('2026-01-01')).toBe('2025-12-31');
  });

  it('crosses leap-day boundaries', () => {
    expect(previousDayKey('2028-03-01')).toBe('2028-02-29');
  });
});

describe('computeStreakDays', () => {
  it('counts consecutive days ending today', () => {
    const days = ['2026-01-05', '2026-01-04', '2026-01-03'];
    expect(computeStreakDays(days, '2026-01-05')).toBe(3);
  });

  it('does NOT count non-consecutive unique days (the streak bug)', () => {
    // Old implementation returned 3 (unique day count); a real streak is 1.
    const days = ['2026-01-05', '2026-01-01', '2025-12-20'];
    expect(computeStreakDays(days, '2026-01-05')).toBe(1);
  });

  it('keeps the streak alive through a rest day today (grace to yesterday)', () => {
    const days = ['2026-01-04', '2026-01-03'];
    expect(computeStreakDays(days, '2026-01-05')).toBe(2);
  });

  it('breaks the streak when the last workout was more than a day ago', () => {
    expect(computeStreakDays(['2026-01-03'], '2026-01-05')).toBe(0);
  });

  it('counts duplicate same-day entries once', () => {
    const days = ['2026-01-05', '2026-01-05', '2026-01-04'];
    expect(computeStreakDays(days, '2026-01-05')).toBe(2);
  });

  it('returns 0 for no workouts', () => {
    expect(computeStreakDays([], '2026-01-05')).toBe(0);
  });
});

describe('computeVolumeHistory', () => {
  const tz = 'UTC';

  it('returns `days` points, oldest first, ending today', () => {
    const history = computeVolumeHistory([], '2026-01-07', tz, 7);
    expect(history).toHaveLength(7);
    expect(history[0].date).toBe('2026-01-01');
    expect(history[6].date).toBe('2026-01-07');
    expect(history.every((p) => p.volume === 0)).toBe(true);
  });

  it('sums volume into the correct day bucket and zero-fills the rest', () => {
    const workouts = [
      { endedAt: new Date('2026-01-07T10:00:00Z'), totalVolume: 100 },
      { endedAt: new Date('2026-01-07T18:00:00Z'), totalVolume: 50 },
      { endedAt: new Date('2026-01-05T09:00:00Z'), totalVolume: 200 },
    ];
    const history = computeVolumeHistory(workouts, '2026-01-07', tz, 7);
    const byDate = Object.fromEntries(history.map((p) => [p.date, p.volume]));
    expect(byDate['2026-01-07']).toBe(150);
    expect(byDate['2026-01-05']).toBe(200);
    expect(byDate['2026-01-06']).toBe(0);
  });

  it('buckets volume using the user timezone', () => {
    // 02:00 UTC Jan 7 => Jan 6 in New York, so it lands in the Jan-6 bucket.
    const workouts = [{ endedAt: new Date('2026-01-07T02:00:00Z'), totalVolume: 80 }];
    const history = computeVolumeHistory(workouts, '2026-01-06', 'America/New_York', 7);
    const byDate = Object.fromEntries(history.map((p) => [p.date, p.volume]));
    expect(byDate['2026-01-06']).toBe(80);
  });
});

describe('computeWorkoutTotals', () => {
  it('sums weight x reps across sets', () => {
    const sets = [
      { exerciseId: 'a', actualWeight: 100, actualReps: 5 },
      { exerciseId: 'a', actualWeight: 100, actualReps: 3 },
    ];
    expect(computeWorkoutTotals(sets)).toEqual({ totalSets: 2, totalVolume: 800 });
  });

  it('treats missing weight/reps as zero', () => {
    const sets = [{ exerciseId: 'a' }, { exerciseId: 'b', actualReps: 10 }];
    expect(computeWorkoutTotals(sets)).toEqual({ totalSets: 2, totalVolume: 0 });
  });
});

describe('computeBestByExercise', () => {
  it('ranks by weight then reps per exercise', () => {
    const sets = [
      { exerciseId: 'squat', actualWeight: 100, actualReps: 5 },
      { exerciseId: 'squat', actualWeight: 120, actualReps: 3 },
      { exerciseId: 'squat', actualWeight: 120, actualReps: 5 },
      { exerciseId: 'bench', actualWeight: 80, actualReps: 8 },
    ];
    expect(computeBestByExercise(sets)).toEqual({
      squat: { weight: 120, reps: 5 },
      bench: { weight: 80, reps: 8 },
    });
  });
});
