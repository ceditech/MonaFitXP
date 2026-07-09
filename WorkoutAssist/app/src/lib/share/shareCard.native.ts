
// NATIVE share path: capture the off-screen card view → system share sheet.

import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import type { ShareCardData } from './shareCard.types';

/**
 * Capture the referenced view as a PNG and open the platform share sheet.
 * `_data` is unused here (the view is already rendered) but keeps the
 * signature identical to the web module. Returns false when sharing
 * isn't available on this device.
 */
export async function shareCard(
    viewRef: React.Component | React.RefObject<any>,
    _data?: ShareCardData,
): Promise<boolean> {
    const available = await Sharing.isAvailableAsync();
    if (!available) {
        console.warn('[shareCard] Sharing not available on this device');
        return false;
    }

    const uri = await captureRef(viewRef as any, {
        format: 'png',
        quality: 1,
    });

    await Sharing.shareAsync(uri, {
        mimeType: 'image/png',
        dialogTitle: 'Share your workout',
    });
    return true;
}
