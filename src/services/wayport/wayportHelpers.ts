import { DownloadJobProgressInfo } from '@store/DownloadMode/reducer';
import { CheckJobStatusResponse } from './wayportGPService';

/**
 * Extracts the number of bundles from a progress message string.
 *
 * @param text - The message text in format "Expecting 33 bundles, 75238 tiles"
 * @returns The number of bundles, or null if not found
 *
 * @example
 * extractBundleCount("Expecting 33 bundles, 75238 tiles") // returns 33
 */
export const extractBundleCount = (text: string): number | null => {
    if (!text) {
        return null;
    }

    const match = text.match(/Expecting (\d+) bundles/i);
    return match ? parseInt(match[1], 10) : null;
};

/**
 * Extracts the completed bundle count from a progress message string.
 *
 * @param text - The message text in format "32 75237 Adding WB_2022_R14 1/0/0, tile/L01/R0000C0000.bundle"
 * @returns The completed bundle count (bundle number + 1), or null if not found
 *
 */
export const extractCompletedBundles = (text: string): number | null => {
    if (!text) {
        return null;
    }

    // Match pattern: "{bundle_number} {tile_count} Adding ..."
    const match = text.match(/^(\d+)\s+\d+\s+Adding/i);
    return match ? parseInt(match[1], 10) : null;
};

export const parseDownloadJobProgress = (
    res: CheckJobStatusResponse
): DownloadJobProgressInfo => {
    if (!res || !res?.messages || res?.messages?.length === 0) {
        return null;
    }

    const messages = res.messages;

    let totalBundles = 0;
    let completedBundles = 0;

    // Loop through all messages to find the one that contains the total bundle count
    for (const message of messages) {
        const text = message.description || '';

        if (!text) {
            continue;
        }

        const bundles = extractBundleCount(text);

        if (bundles !== null) {
            totalBundles = bundles;
            break;
        }
    }

    if (totalBundles === 0) {
        // If we cannot find the total bundle count from the messages, we cannot determine the progress, so we return null
        return null;
    }

    for (let i = messages.length - 1; i >= 0; i--) {
        const text = messages[i].description || '';

        if (!text) {
            continue;
        }

        const bundles = extractCompletedBundles(text);

        if (bundles !== null) {
            completedBundles = bundles;
            break;
        }
    }

    const progressPercentage =
        totalBundles > 0 ? (completedBundles / totalBundles) * 100 : 0;

    return {
        totalBundles,
        completedBundles,
        progressPercentage: Math.round(progressPercentage),
    };
};
