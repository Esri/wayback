import { test, expect } from '@playwright/test';
import { DEV_SERVER_URL } from '../playwright.config';
import {
    mockNetworkRequests,
    resetMockedNetworkRequest,
} from '../helpers/mockNetworkRequests';

test.describe('Wayback - Explorer Mode', () => {
    test('Verify Explorer Mode functionalities', async ({ page }) => {
        await mockNetworkRequests(page);

        await page.goto(
            DEV_SERVER_URL + '/#mapCenter=-117.19462%2C34.05786%2C17'
        );

        // verify the "explore mode" button is visible and active
        const exploreModeButton = page.getByTestId('explore-mode-toggle-btn');
        await expect(exploreModeButton).toBeVisible();
        await expect(exploreModeButton).toHaveAttribute('data-active', 'true');

        // verify the releases bar charts are visible and can be interacted with

        await page.pause();

        // clean up mocked network requests
        await resetMockedNetworkRequest(page);
    });
});
