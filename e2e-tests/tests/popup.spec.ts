import { test, expect } from '@playwright/test';
import { DEV_SERVER_URL } from '../playwright.config';
import {
    mockNetworkRequests,
    resetMockedNetworkRequest,
} from '../helpers/mockNetworkRequests';

test.describe('Wayback - Map Popup', () => {
    test('Verify Popup functionalities', async ({ page }) => {
        await mockNetworkRequests(page);

        // Navigate to the Explorer Mode page
        await page.goto(
            DEV_SERVER_URL + '/#mapCenter=-117.19462%2C34.05786%2C17'
        );

        // Clean up mocked network requests
        await resetMockedNetworkRequest(page);
    });
});
