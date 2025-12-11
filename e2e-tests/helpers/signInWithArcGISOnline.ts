import { test, expect, Page } from '@playwright/test';
import { DEV_SERVER_URL } from '../playwright.config';

export const signInWithArcGISOnline = async (page: Page) => {
    if (
        !process.env.E2E_TEST_ARCGIS_ONLINE_USERNAME ||
        !process.env.E2E_TEST_ARCGIS_ONLINE_PASSWORD
    ) {
        throw new Error(
            'E2E_TEST_ARCGIS_ONLINE_USERNAME and E2E_TEST_ARCGIS_ONLINE_PASSWORD must be set in the environment variables'
        );
    }

    // expect to be directed to ArcGIS Online Login page: https://www.arcgis.com/sharing/oauth2/authorize
    await expect(page).toHaveURL(
        /https:\/\/[a-zA-Z0-9-]+\.arcgis\.com\/sharing\/oauth2\/authorize/
    );

    // fill in the username and password fields on the ArcGIS login page
    await page.fill(
        'input[name="username"]',
        `${process.env.E2E_TEST_ARCGIS_ONLINE_USERNAME}`
    );
    await page.fill(
        'input[name="password"]',
        `${process.env.E2E_TEST_ARCGIS_ONLINE_PASSWORD}`
    );

    await page.locator('button[type="submit"]').click();

    // Wait for the redirect back to the nomination app after successful login
    await page.waitForURL(DEV_SERVER_URL + '**/#*');
};
