
// Pure barbell plate calculator. No React Native imports.

export interface PlateBreakdown {
    /** Plates per side, heaviest first (e.g. [20, 10, 2.5]). */
    platesPerSide: number[];
    /** The weight actually reachable with the available plates. */
    achievableWeight: number;
    /** targetWeight - achievableWeight (0 when exact). */
    remainder: number;
    barWeight: number;
}

export const DEFAULT_PLATES = [25, 20, 15, 10, 5, 2.5, 1.25];
export const DEFAULT_BAR_WEIGHT = 20;

/**
 * Greedy per-side plate breakdown for a target total barbell weight.
 * Returns null when the target is below the bar weight or invalid.
 */
export function platesFor(
    targetWeight: number,
    barWeight: number = DEFAULT_BAR_WEIGHT,
    availablePlates: number[] = DEFAULT_PLATES,
): PlateBreakdown | null {
    if (!Number.isFinite(targetWeight) || targetWeight < barWeight || barWeight < 0) {
        return null;
    }

    const plates = [...availablePlates].sort((a, b) => b - a);
    let perSideRemaining = (targetWeight - barWeight) / 2;
    const platesPerSide: number[] = [];

    for (const plate of plates) {
        while (perSideRemaining >= plate - 1e-9) {
            platesPerSide.push(plate);
            perSideRemaining -= plate;
        }
    }

    const achievableWeight = barWeight + (platesPerSide.reduce((a, b) => a + b, 0) * 2);
    // Guard floating point drift (e.g. 0.30000000000000004)
    const remainder = Math.round((targetWeight - achievableWeight) * 100) / 100;

    return { platesPerSide, achievableWeight, remainder, barWeight };
}
