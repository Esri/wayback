import { test, expect } from '@playwright/test';
import { DEV_SERVER_URL } from '../playwright.config';
import {
    mockNetworkRequests,
    resetMockedNetworkRequest,
} from '../helpers/mockNetworkRequests';
import { signInWithArcGISOnline } from '../helpers/signInWithArcGISOnline';

test.describe('Wayback - Updates Mode', () => {
    test('Updates Mode shows sign-in prompt for anonymous user and enables filters after authentication', async ({
        page,
    }) => {
        await mockNetworkRequests(page);

        // Navigate to the page
        await page.goto(
            DEV_SERVER_URL + '/#mapCenter=-117.19462%2C34.05786%2C17'
        );

        // locate and click the Updates Mode button to open updates mode
        const updatesModeButton = page.getByTestId('updates-mode-toggle-btn');
        await expect(updatesModeButton).toBeVisible();
        await updatesModeButton.click();

        // Verify that the Updates Mode is activated but filters are disabled due to anonymous user
        const filtersContainer = page.getByTestId(
            'updates-mode-filters-container'
        );
        await expect(filtersContainer).toHaveClass(/disabled/);

        // verify that the sign-in prompt is shown
        const signInPrompt = page.getByTestId('updates-mode-sign-in-prompt');
        await expect(signInPrompt).toBeVisible();

        // locate the sign-in button within the prompt and verify it's visible
        const signInButton = signInPrompt.getByTestId(
            'updates-mode-sign-in-button'
        );
        await expect(signInButton).toBeVisible();

        // click the sign-in button
        await signInButton.click();

        // Sign in to ArcGIS Online
        await signInWithArcGISOnline(page);

        // Verify that the filters are now enabled after sign-in
        await expect(filtersContainer).not.toHaveClass(/disabled/);

        // Verify that the sign-in prompt is no longer visible
        await expect(signInPrompt).toBeHidden();

        // Clean up mocked network requests
        await resetMockedNetworkRequest(page);
    });
});
