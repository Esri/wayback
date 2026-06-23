import { test, expect } from '@playwright/test';
// import { DEV_SERVER_URL } from '../playwright.config';
import {
    mockNetworkRequests,
    resetMockedNetworkRequest,
} from '../helpers/mockNetworkRequests';
import { DEFAULT_APP_URL } from './constants';

test.describe('Wayback - Explorer Mode', () => {
    test('Verify Explorer Mode functionalities', async ({ page }) => {
        await mockNetworkRequests(page);

        // Navigate to the Explorer Mode page
        await page.goto(DEFAULT_APP_URL);

        // Verify the "Explore Mode" button is visible and active
        const exploreModeButton = page.getByTestId('explore-mode-toggle-btn');
        await expect(exploreModeButton).toBeVisible();
        await expect(exploreModeButton).toHaveAttribute('data-active', 'true');

        // Verify the card list is visible and contains items
        const list = page.getByTestId('card-list');
        await expect(list).toBeVisible();

        // Select all cards in the list
        const listCards = page.locator('[data-testid^="list-card-"]');

        // Wait for at least one card to be visible
        await expect(listCards.first()).toBeVisible({ timeout: 30000 });

        // Verify there is at least one card in the list
        const listCardCount = await listCards.count();
        expect(listCardCount).toBeGreaterThan(0);

        // For the mocked data, there should be exactly 3 releases with local changes, so we expect 3 cards in the list.
        expect(listCardCount).toBe(3);

        // Click the first card in the list and verify it is selected
        const firstCard = listCards.nth(0);
        await expect(firstCard).toBeVisible();
        await firstCard.click();
        await expect(firstCard).toHaveAttribute('data-active', 'true');

        // Get the release number of the first card for later verification
        const releaseNum =
            (await firstCard.getAttribute('data-release-num')) || '';

        // Verify the preview window appears on the map with the correct release number
        await firstCard.hover();
        await verifyPreviewWindowByReleaseNum(page, releaseNum || '');

        // Verify the bar chart is visible
        const barChart = page.getByTestId('releases-bar-chart');
        await expect(barChart).toBeVisible();

        // Find all highlighted bars in the bar chart
        const highlightedBars = barChart.locator('rect.is-highlighted');
        const highlightedBarCount = await highlightedBars.count();
        expect(highlightedBarCount).toBeGreaterThan(0);

        // Verify the bar corresponding to the selected card is active
        const activeBar = barChart.locator(
            `rect[data-release-num="${releaseNum}"]`
        );
        await expect(activeBar).toBeVisible();
        await expect(activeBar).toHaveClass(/is-active/);

        // Find the second highlighted bar in the bar chart
        const secondBar = highlightedBars.nth(1);
        const secondReleaseNum =
            (await secondBar.getAttribute('data-release-num')) || '';

        // Hover over the second highlighted bar and verify the preview window
        // The SVG parent element is intercepting pointer events before they reach the rect child.
        // The fix is to use { force: true } on the hover call to bypass Playwright's actionability checks.
        await secondBar.hover({ force: true });
        await verifyPreviewWindowByReleaseNum(page, secondReleaseNum);

        // Click the second highlighted bar and verify the corresponding card is highlighted
        await secondBar.click();
        const secondCard = page.getByTestId(`list-card-${secondReleaseNum}`);
        await expect(secondCard).toBeVisible();
        await expect(secondCard).toHaveAttribute('data-active', 'true');

        // verify the hash in the URL corresponds to the selected release
        const url = page.url();
        expect(url).toContain(`active=${secondReleaseNum}`);

        // find the "Show Only Local Changes" toggle button and it should be active by default, click it to turn it off, and verify the button state changes accordingly
        const localChangesToggleBtn = page.getByTestId(
            'local-changes-toggle-btn'
        );
        await expect(localChangesToggleBtn).toBeVisible();
        await expect(localChangesToggleBtn).toHaveAttribute(
            'data-checked',
            'true'
        );

        await localChangesToggleBtn.click();
        await expect(localChangesToggleBtn).toHaveAttribute(
            'data-checked',
            'false'
        );

        // After turning off the "Show Only Local Changes" toggle, all cards should be visible in the list
        const updatedListCardCount = await listCards.count();
        expect(updatedListCardCount).toBeGreaterThan(100); // With the mocked data, there should be more than 100 cards in the list when all changes are shown

        // Clean up mocked network requests
        await resetMockedNetworkRequest(page);
    });
});

/**
 * Verify the preview window is visible and displays the correct release number
 * @param page Playwright page object
 * @param releaseNum Release number to verify
 */
const verifyPreviewWindowByReleaseNum = async (
    page: any,
    releaseNum: string
) => {
    const previewWindow = page.getByTestId('preview-window-container');
    await expect(previewWindow).toBeVisible({
        timeout: 30000,
    });
    await expect(previewWindow).toHaveAttribute('data-release-num', releaseNum);
};
