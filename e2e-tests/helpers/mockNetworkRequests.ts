import { test, expect, Page } from '@playwright/test';
import {
    mockedMetadataQueryResponse,
    mockedMetadataQueryResponse2014R1,
    mockedWaybackConfigResponse,
    mockedTilemapResponses,
    mockedMetadataQueryResponse2016R3,
    mockedMetadataQueryResponse2018R5,
    mockedMetadataQueryResponse2024R7,
} from './mockedResponse';

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

    await page.route('**/waybackconfig.json', async (route) => {
        console.log('Mocked waybackconfig.json request intercepted');
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(mockedWaybackConfigResponse),
        });
    });

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

    // Mocked response for World Imagery Metadata query
    await page.route(
        '**/arcgis/rest/services/World_Imagery_Metadata_*/MapServer/*/query*',
        async (route) => {
            console.log('Mocked World Imagery Metadata query intercepted');

            // check if the url contains 2014_r01, if so, return different mocked response
            const url = route.request().url();
            if (url.includes('World_Imagery_Metadata_2014_r01')) {
                console.log(
                    'Using mockedMetadataQueryResponse2014R1 for 2014_r01'
                );

                return await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify(mockedMetadataQueryResponse2014R1),
                });
            }

            if (url.includes('World_Imagery_Metadata_2016_r03')) {
                console.log('Using mockedMetadataQueryResponse for 2016_r03');

                return await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify(mockedMetadataQueryResponse2016R3),
                });
            }

            if (url.includes('World_Imagery_Metadata_2018_r05')) {
                console.log('Using mockedMetadataQueryResponse for 2018_r05');

                return await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify(mockedMetadataQueryResponse2018R5),
                });
            }

            if (url.includes('World_Imagery_Metadata_2024_r07')) {
                console.log('Using mockedMetadataQueryResponse for 2024_r07');

                return await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify(mockedMetadataQueryResponse2024R7),
                });
            }

            console.log('Using default mockedMetadataQueryResponse');
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(mockedMetadataQueryResponse),
            });
        }
    );

    // Mocked response for World Imagery tilemap requests, returned in sequence, looping back to the start after the last one
    let tilemapRequestCount = 0;
    await page.route(
        '**/arcgis/rest/services/World_Imagery/MapServer/tilemap/**',
        async (route) => {
            const index = tilemapRequestCount;
            console.log(
                `Mocked World Imagery tilemap request intercepted (response #${index})`
            );
            tilemapRequestCount =
                (tilemapRequestCount + 1) % mockedTilemapResponses.length;

            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(mockedTilemapResponses[index]),
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
    await page.unroute(
        '**/arcgis/rest/services/World_Imagery_Metadata_*/MapServer/*/query*'
    );
    await page.unroute(
        '**/arcgis/rest/services/World_Imagery/MapServer/tilemap/**'
    );
    await page.unroute('**/waybackconfig.json');
};
