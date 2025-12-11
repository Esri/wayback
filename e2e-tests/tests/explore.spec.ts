import { test, expect } from '@playwright/test';
import { DEV_SERVER_URL } from '../playwright.config';
import {
    mockNetworkRequests,
    resetMockedNetworkRequest,
} from '../helpers/mockNetworkRequests';

test.describe('Wayback - Explorer Mode', () => {
    test('Verify Explorer Mode functionalities', async ({ page }) => {
        await mockNetworkRequests(page);

        // Navigate to the Explorer Mode page
        await page.goto(
            DEV_SERVER_URL + '/#mapCenter=-117.19462%2C34.05786%2C17'
        );

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
        await expect(listCards.first()).toBeVisible({ timeout: 10000 });

        // Verify there is at least one card in the list
        const listCardCount = await listCards.count();
        expect(listCardCount).toBeGreaterThan(0);

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
        const secondHighlightedBar = highlightedBars.nth(1);
        const highlightedBarReleaseNum =
            (await secondHighlightedBar.getAttribute('data-release-num')) || '';

        // Hover over the second highlighted bar and verify the preview window
        await secondHighlightedBar.hover();
        await verifyPreviewWindowByReleaseNum(page, highlightedBarReleaseNum);

        // Click the second highlighted bar and verify the corresponding card is highlighted
        await secondHighlightedBar.click();
        const highlightedCard = page.getByTestId(
            `list-card-${highlightedBarReleaseNum}`
        );
        await expect(highlightedCard).toBeVisible();
        await expect(highlightedCard).toHaveAttribute('data-active', 'true');

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
    await expect(previewWindow).toBeVisible();
    await expect(previewWindow).toHaveAttribute('data-release-num', releaseNum);
};
