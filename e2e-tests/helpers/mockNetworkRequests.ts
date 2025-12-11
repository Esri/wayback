import { test, expect, Page } from '@playwright/test';

/**
 * Mock the network requests for the Wayback app.
 * Using the mocked data to ensure the test is isolated and does not depend on live API responses.
 * @param page
 */
export const mockNetworkRequests = async (page: Page) => {
    // Intercept and block the script
    await page.route('https://mtags.arcgis.com/tags-min.js', (route) =>
        route.abort()
    );

    await page.route(
        '**/sharing/rest/content/users/*/addItem',
        async (route) => {
            console.log('Mocked addItem request intercepted');
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    success: true,
                    id: 'mocked-item-id',
                    folder: '',
                }),
            });
        }
    );

    // Mocked response of update ArcGIS Online item info
    await page.route(
        '**/sharing/rest/content/users/*/items/*/update',
        async (route) => {
            console.log('Mocked update item request intercepted');
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    success: true,
                    id: 'mocked-item-id',
                }),
            });
        }
    );
};

/**
 * Resets mocked network requests by removing specific routes from the given Playwright `page` instance.
 *
 * This function ensures that the specified network routes are unregistered, allowing the page to handle
 * these requests normally or to set up new mocks as needed.
 *
 * @param page - The Playwright `Page` object representing the browser page where the routes should be unregistered.
 * @returns A promise that resolves when all specified routes have been unregistered.
 */
export const resetMockedNetworkRequest = async (page: Page) => {
    await page.unroute('https://mtags.arcgis.com/tags-min.js');
    await page.unroute('**/sharing/rest/content/users/*/addItem');
    await page.unroute('**/sharing/rest/content/users/*/items/*/update');
};
