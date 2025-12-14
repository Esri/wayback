import { test, expect } from '@playwright/test';
import { DEV_SERVER_URL } from '../playwright.config';
import {
    mockNetworkRequests,
    resetMockedNetworkRequest,
} from '../helpers/mockNetworkRequests';
import { signInWithArcGISOnline } from '../helpers/signInWithArcGISOnline';

test.describe('Wayback - User Profile Dialog', () => {
    test('Verify User Profile Dialog functionalities', async ({ page }) => {
        await mockNetworkRequests(page);

        // Navigate to the page
        await page.goto(
            DEV_SERVER_URL + '/#mapCenter=-117.19462%2C34.05786%2C17'
        );

        // locate and click the User Profile button to open the dialog
        const userProfileButton = page.getByTestId('user-profile-btn');
        await expect(userProfileButton).toBeVisible();
        await userProfileButton.click();

        // Sign in to ArcGIS Online
        await signInWithArcGISOnline(page);

        // verify the User Profile button shows signed-in state
        await expect(userProfileButton).toHaveAttribute(
            'data-signed-user',
            `${process.env.E2E_TEST_ARCGIS_ONLINE_USERNAME}`
        );

        // Click the User Profile button again to open the dialog
        await userProfileButton.click();

        // Verify that the User Profile dialog is visible
        const userProfileDialog = page.getByTestId('user-profile-dialog');
        await expect(userProfileDialog).toBeVisible();

        // Verify user information is displayed correctly
        const userProfileNameLink = page.getByTestId('user-profile-name-link');
        await expect(userProfileNameLink).toBeVisible();

        // locate close profile card button and click to close the dialog
        const closeProfileCardButton = page.getByTestId(
            'close-profile-card-btn'
        );
        await expect(closeProfileCardButton).toBeVisible();
        await closeProfileCardButton.click();

        // Verify that the User Profile dialog is closed
        await expect(userProfileDialog).toBeHidden();

        // Open the User Profile dialog again
        await userProfileButton.click();
        await expect(userProfileDialog).toBeVisible();

        // Locate and click the Sign Out button
        const signOutButton = page.getByTestId('sign-out-btn');
        await expect(signOutButton).toBeVisible();
        await signOutButton.click();

        // Verify that the User Profile dialog is closed after signing out
        await expect(userProfileDialog).toBeHidden();

        // Verify that the User Profile button shows signed-out state
        await expect(userProfileButton).not.toHaveAttribute('data-signed-user');

        // Clean up mocked network requests
        await resetMockedNetworkRequest(page);
    });
});
