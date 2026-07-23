import { calculateAge, isValidDateOfBirth, meetsMinimumAge, MIN_AGE } from '../age';

// Fixed "now" so tests are deterministic regardless of when they run.
const NOW = new Date('2026-07-23T12:00:00Z');

describe('calculateAge', () => {
    it('counts whole years', () => {
        expect(calculateAge('2000-07-23', NOW)).toBe(26);
    });

    it('does not count the current year before the birthday', () => {
        expect(calculateAge('2000-07-24', NOW)).toBe(25); // birthday tomorrow
    });

    it('counts the year on the birthday itself', () => {
        expect(calculateAge('2000-07-23', NOW)).toBe(26); // birthday today
    });

    it('handles leap-day births', () => {
        expect(calculateAge('2008-02-29', NOW)).toBe(18);
    });

    it('returns NaN for an unparseable date', () => {
        expect(Number.isNaN(calculateAge('not-a-date', NOW))).toBe(true);
    });
});

describe('isValidDateOfBirth', () => {
    it('accepts a normal date', () => {
        expect(isValidDateOfBirth('1990-01-15', NOW)).toBe(true);
    });

    it('rejects the wrong format', () => {
        expect(isValidDateOfBirth('01/15/1990', NOW)).toBe(false);
        expect(isValidDateOfBirth('1990-1-5', NOW)).toBe(false);
    });

    it('rejects impossible calendar dates', () => {
        expect(isValidDateOfBirth('2021-02-30', NOW)).toBe(false);
        expect(isValidDateOfBirth('2021-13-01', NOW)).toBe(false);
    });

    it('rejects a future date', () => {
        expect(isValidDateOfBirth('2030-01-01', NOW)).toBe(false);
    });

    it('rejects an absurdly old date', () => {
        expect(isValidDateOfBirth('1850-01-01', NOW)).toBe(false);
    });
});

describe('meetsMinimumAge', () => {
    it('is true at exactly the minimum age', () => {
        // Turns 16 on 2026-07-23 (today).
        expect(meetsMinimumAge('2010-07-23', NOW)).toBe(true);
    });

    it('is false one day before turning 16', () => {
        expect(meetsMinimumAge('2010-07-24', NOW)).toBe(false);
    });

    it('is false for a clearly under-age user', () => {
        expect(meetsMinimumAge('2015-01-01', NOW)).toBe(false);
    });

    it('is false for an invalid date', () => {
        expect(meetsMinimumAge('garbage', NOW)).toBe(false);
    });

    it('uses MIN_AGE of 16', () => {
        expect(MIN_AGE).toBe(16);
    });
});
