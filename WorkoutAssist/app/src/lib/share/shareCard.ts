
// WEB share path (Metro picks shareCard.native.ts on iOS/Android).
// Draws the card deterministically onto an off-screen 1080x1080 canvas —
// no html2canvas dependency — then Web Share API or PNG download.
// DOM access via globalThis casts (RN tsconfig has no DOM lib).

import { ShareCardData } from './shareCard.types';

const SIZE = 1080;

function drawCard(ctx: any, data: ShareCardData): void {
    // Background gradient (brandDarkBlue → brandPurpleDark)
    const bg = ctx.createLinearGradient(0, 0, SIZE, SIZE);
    bg.addColorStop(0, '#1A1A2E');
    bg.addColorStop(1, '#2A1040');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, SIZE, SIZE);

    // Accent ring
    ctx.strokeStyle = 'rgba(142, 36, 170, 0.5)';
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.arc(SIZE / 2, 330, 180, 0, Math.PI * 2);
    ctx.stroke();

    ctx.textAlign = 'center';

    // Wordmark
    ctx.fillStyle = '#FF7A29';
    ctx.font = '900 52px sans-serif';
    ctx.fillText('MonaFitXP', SIZE / 2, 110);

    // Workout name + date
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '800 64px sans-serif';
    ctx.fillText(data.workoutName, SIZE / 2, 200);
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '600 34px sans-serif';
    ctx.fillText(data.dateLabel, SIZE / 2, 250);

    // Duration (in the ring)
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 96px sans-serif';
    ctx.fillText(data.durationLabel, SIZE / 2, 350);
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '700 30px sans-serif';
    ctx.fillText('DURATION', SIZE / 2, 400);

    // Stats row
    const stats: [string, string][] = [
        [String(data.totalSets), 'SETS'],
        [`${data.totalVolume}`, 'VOLUME (KG)'],
        [data.bestSetLabel || '—', 'BEST SET'],
    ];
    const colWidth = SIZE / stats.length;
    stats.forEach(([value, label], i) => {
        const x = colWidth * i + colWidth / 2;
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '900 60px sans-serif';
        ctx.fillText(value, x, 640);
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.font = '700 26px sans-serif';
        ctx.fillText(label, x, 685);
    });

    // XP / level / streak footer
    const footerBits: string[] = [];
    if (data.xpGained != null) footerBits.push(`+${data.xpGained} XP`);
    if (data.level != null) footerBits.push(`Level ${data.level}`);
    if (data.streakDays != null && data.streakDays > 0) footerBits.push(`${data.streakDays}-day streak`);
    if (footerBits.length > 0) {
        ctx.fillStyle = '#FF7A29';
        ctx.font = '800 44px sans-serif';
        ctx.fillText(footerBits.join('   ·   '), SIZE / 2, 820);
    }

    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.font = '600 30px sans-serif';
    ctx.fillText('Tracked with MonaFitXP', SIZE / 2, 990);
}

/**
 * Render the card to a canvas and share it: Web Share API with file support
 * when available, otherwise a PNG download. The unused `_viewRef` keeps the
 * signature identical to the native module.
 */
export async function shareCard(_viewRef: unknown, data?: ShareCardData): Promise<boolean> {
    const doc = (globalThis as any).document;
    const nav = (globalThis as any).navigator;
    if (!doc || !data) return false;

    const canvas = doc.createElement('canvas');
    canvas.width = SIZE;
    canvas.height = SIZE;
    const ctx = canvas.getContext('2d');
    if (!ctx) return false;

    drawCard(ctx, data);

    const blob: Blob | null = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
    if (!blob) return false;

    const file = new (globalThis as any).File([blob], 'monafitxp-workout.png', { type: 'image/png' });

    if (nav?.canShare?.({ files: [file] })) {
        try {
            await nav.share({ files: [file], title: 'My workout' });
            return true;
        } catch (e: any) {
            if (e?.name === 'AbortError') return true; // user closed the sheet
            // fall through to download
        }
    }

    const url = (globalThis as any).URL.createObjectURL(blob);
    const a = doc.createElement('a');
    a.href = url;
    a.download = 'monafitxp-workout.png';
    a.click();
    (globalThis as any).URL.revokeObjectURL(url);
    return true;
}
