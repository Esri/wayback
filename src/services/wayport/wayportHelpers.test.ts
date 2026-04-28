/* Copyright 2024-2026 Esri
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

import {
    extractBundleCount,
    extractCompletedBundles,
    extractAlternativeFileNameFromMessages,
} from './wayportHelpers';
import { CheckJobStatusResponse } from './wayportGPService';

describe('test extractBundleCount function', () => {
    it('should return correct bundle count when valid message is provided', () => {
        const message = 'Expecting 33 bundles, 75238 tiles';
        expect(extractBundleCount(message)).toBe(33);
    });

    it('should return null when message is empty', () => {
        const message = '';
        expect(extractBundleCount(message)).toBeNull();
    });

    it('should return null when message does not contain bundle info', () => {
        const message = 'Processing tiles, 75238 tiles';
        expect(extractBundleCount(message)).toBeNull();
    });

    it('should return null when message is null', () => {
        const message = null as unknown as string;
        expect(extractBundleCount(message)).toBeNull();
    });
});

describe('test extractCompletedBundles function', () => {
    it('should return correct completed bundle count when valid progress message is provided', () => {
        const message =
            '32 75237 Adding WB_2022_R14 1/0/0, tile/L01/R0000C0000.bundle';
        expect(extractCompletedBundles(message)).toBe(32);
    });

    it('should return correct count for bundle 0 (first bundle)', () => {
        const message =
            '0 0 Adding WB_2025_R11 19/3338/1787, tile/L19/R37d80C68500.bundle';
        expect(extractCompletedBundles(message)).toBe(0);
    });

    it('should return correct count for mid-progress bundle', () => {
        const message =
            '5 21634 Adding WB_2025_R11 19/3340/1788, tile/L19/R37e00C68600.bundle';
        expect(extractCompletedBundles(message)).toBe(5);
    });

    it('should return null when message is empty', () => {
        const message = '';
        expect(extractCompletedBundles(message)).toBeNull();
    });

    it('should return null when message does not match the pattern', () => {
        const message = 'Expecting 33 bundles, 75238 tiles';
        expect(extractCompletedBundles(message)).toBeNull();
    });

    it('should return null when message is in wrong format (no Adding keyword)', () => {
        const message = '32 75237 Processing tiles';
        expect(extractCompletedBundles(message)).toBeNull();
    });

    it('should return null when message starts with text before numbers', () => {
        const message = 'Progress: 5 21634 Adding WB_2025_R11';
        expect(extractCompletedBundles(message)).toBeNull();
    });

    it('should return null when message is null', () => {
        const message = null as unknown as string;
        expect(extractCompletedBundles(message)).toBeNull();
    });
});

describe('test extractAlternativeFileNameFromMessage function', () => {
    const createResponse = (
        descriptions: string[]
    ): CheckJobStatusResponse => ({
        jobId: 'test-job-id',
        jobStatus: 'esriJobSucceeded' as any,
        messages: descriptions.map((desc) => ({ description: desc })),
    });

    it('should extract file name from message matching Output:{name}.tpkx pattern', () => {
        const res = createResponse([
            'Some other message',
            'Output:j8b480d1e78244982a59dc22dfac36d44.tpkx',
        ]);
        expect(extractAlternativeFileNameFromMessages(res)).toBe(
            'j8b480d1e78244982a59dc22dfac36d44.tpkx'
        );
    });

    it('should return the last matching message when multiple matches exist', () => {
        const res = createResponse([
            'Output:first.tpkx',
            'Some other message',
            'Output:second.tpkx',
        ]);
        expect(extractAlternativeFileNameFromMessages(res)).toBe('second.tpkx');
    });

    it('should return null when no message matches the pattern', () => {
        const res = createResponse([
            'Some random message',
            'Expecting 33 bundles, 75238 tiles',
        ]);
        expect(extractAlternativeFileNameFromMessages(res)).toBeNull();
    });

    it('should return null when messages array is empty', () => {
        const res = createResponse([]);
        expect(extractAlternativeFileNameFromMessages(res)).toBeNull();
    });

    it('should return null when response is null', () => {
        expect(extractAlternativeFileNameFromMessages(null as any)).toBeNull();
    });

    it('should return null when response has no messages property', () => {
        const res = {
            jobId: 'test',
            jobStatus: 'esriJobSucceeded',
        } as CheckJobStatusResponse;
        expect(extractAlternativeFileNameFromMessages(res)).toBeNull();
    });

    it('should return null when file does not end with .tpkx', () => {
        const res = createResponse(['Output:somefile.zip']);
        expect(extractAlternativeFileNameFromMessages(res)).toBeNull();
    });

    it('should skip empty description strings', () => {
        const res = createResponse(['', 'Output:abc123.tpkx']);
        expect(extractAlternativeFileNameFromMessages(res)).toBe('abc123.tpkx');
    });
});
