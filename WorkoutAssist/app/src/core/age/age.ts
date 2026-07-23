/**
 * Age gating (GDPR Art. 8 / app eligibility). We store only the date of birth and
 * derive age on demand — a stored age would go stale, and DOB is the minimum data
 * needed. The Firestore rule makes dateOfBirth write-once so it can't be edited to
 * slip past the gate after the fact (see firestore.rules).
 */

/** Minimum age to use the app. Matches the Terms and Privacy Policy. */
export const MIN_AGE = 16;

/** Oldest plausible DOB — guards against fat-fingered / garbage years. */
const MAX_AGE = 120;

const DOB_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/** Parse 'YYYY-MM-DD' into numeric parts without timezone drift (no Date()). */
function parts(dateOfBirth: string): { y: number; m: number; d: number } | null {
    if (!DOB_PATTERN.test(dateOfBirth)) return null;
    const [y, m, d] = dateOfBirth.split('-').map(Number);
    // Reject impossible calendar dates (incl. things like 2021-02-30).
    if (m < 1 || m > 12 || d < 1 || d > 31) return null;
    const probe = new Date(Date.UTC(y, m - 1, d));
    if (probe.getUTCFullYear() !== y || probe.getUTCMonth() !== m - 1 || probe.getUTCDate() !== d) {
        return null;
    }
    return { y, m, d };
}

/**
 * Whole years between the DOB and `now`. Computed from calendar parts (not epoch
 * math) so it is exact regardless of timezone and correct on the birthday itself.
 * Returns NaN for an unparseable date.
 */
export function calculateAge(dateOfBirth: string, now: Date = new Date()): number {
    const p = parts(dateOfBirth);
    if (!p) return NaN;
    let age = now.getFullYear() - p.y;
    const beforeBirthday =
        now.getMonth() + 1 < p.m ||
        (now.getMonth() + 1 === p.m && now.getDate() < p.d);
    if (beforeBirthday) age -= 1;
    return age;
}

/** A well-formed DOB that is a real date, not in the future, and not absurdly old. */
export function isValidDateOfBirth(dateOfBirth: string, now: Date = new Date()): boolean {
    if (!parts(dateOfBirth)) return false;
    const age = calculateAge(dateOfBirth, now);
    return age >= 0 && age <= MAX_AGE;
}

/** True only for a valid DOB whose derived age is at least MIN_AGE. */
export function meetsMinimumAge(dateOfBirth: string, now: Date = new Date()): boolean {
    return isValidDateOfBirth(dateOfBirth, now) && calculateAge(dateOfBirth, now) >= MIN_AGE;
}
