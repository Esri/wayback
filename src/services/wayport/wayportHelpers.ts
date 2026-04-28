/* Copyright 2024 Esri
 *
 * Licensed under the Apache License Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { WayportJobProgressInfo } from '@store/WayportMode/reducer';
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
): WayportJobProgressInfo => {
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

/**
 * Extracts the alternative file name from the job status response messages.
 *
 * Searches messages in reverse order for one matching the pattern "Output:{file_name}.tpkx".
 *
 * @param res - The check job status response containing messages
 * @returns The extracted file name (e.g. "j8b480d1e78244982a59dc22dfac36d44.tpkx"), or null if not found
 *
 */
export const extractAlternativeFileNameFromMessages = (
    res: CheckJobStatusResponse
): string | null => {
    if (!res) {
        return null;
    }

    const messages = res?.messages || [];

    for (let i = messages.length - 1; i >= 0; i--) {
        const text = messages[i].description || '';

        if (!text) {
            continue;
        }

        // Match pattern: "Output:{file_name}.tpkx"
        // - "Output:"  — literal prefix (case-insensitive)
        // - "(.+\.tpkx)" — capture group: one or more characters ending with ".tpkx"
        // - "$" — anchored to end of string
        // e.g. "Output:j8b480d1e78244982a59dc22dfac36d44.tpkx" → captures "j8b480d1e78244982a59dc22dfac36d44.tpkx"
        const match = text.match(/Output:(.+\.tpkx)$/i);

        if (match) {
            return match[1].trim();
        }
    }

    return null;
};
