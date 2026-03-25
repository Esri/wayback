import { extractBundleCount, extractCompletedBundles } from './wayportHelpers';

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
