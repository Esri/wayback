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
import {
    MOCKED_UNIQUE_REGIONS_FOR_METRO_UPDATES,
    MOCKED_UNIQUE_REGIONS_FOR_REGIONS_UPDATES,
    MOCKED_UNIQUE_REGIONS_FOR_COMMUNITY_UPDATES,
    MOCKED_STATISTIC_RESPONSE_FOR_METRO_UPDATES_US,
    MOCKED_STATISTIC_RESPONSE_FOR_METRO_UPDATES_ALL,
    MOCKED_STATISTIC_RESPONSE_4_COMMUNITY_UPDATES_ALL,
    MOCKED_STATISTIC_RESPONSE_4_REGIONAL_UPDATES_ALL,
    MOCKED_UPDATES_LAYER_EXTENT_RESPONSE,
} from './mockedResponseForUpdatesLayers';

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

    await page.route(
        '**/rest/services/Vivid_Advanced_Blocks_Publication_View/FeatureServer/0/query*',
        async (route) => {
            console.log(
                'Mocked Vivid_Advanced_Blocks_Publication_View query intercepted'
            );

            // if query contains "outFields=Tag", return mocked response with 4 features with different tags, otherwise return empty features
            const url = route.request().url();
            if (url.includes('outFields=Tag&returnDistinctValues=true')) {
                console.log(
                    'intercepted query to fetch unique regions from Vivid_Advanced_Blocks_Publication_View, returning mocked response with 4 unique regions'
                );
                return await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify(
                        MOCKED_UNIQUE_REGIONS_FOR_METRO_UPDATES
                    ),
                });
            }

            if (url.includes('eturnGeometry=false&returnExtentOnly=true')) {
                console.log(
                    'intercepted query to fetch extent from Vivid_Advanced_Blocks_Publication_View, returning mocked response with extent'
                );
                return await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify(MOCKED_UPDATES_LAYER_EXTENT_RESPONSE),
                });
            }

            if (url.includes('outStatistics')) {
                console.log(
                    'intercepted query with outStatistics from Vivid_Advanced_Blocks_Publication_View, returning mocked statistic response'
                );
                const shouldReturnResponseForUS = url.includes(
                    'Tag%20%3D%20%27US%27'
                );

                return await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify(
                        shouldReturnResponseForUS
                            ? MOCKED_STATISTIC_RESPONSE_FOR_METRO_UPDATES_US
                            : MOCKED_STATISTIC_RESPONSE_FOR_METRO_UPDATES_ALL
                    ),
                });
            }
        }
    );

    await page.route(
        '**/rest/services/Vivid_Standard_Blocks_Publication_View/FeatureServer/0/query*',
        async (route) => {
            console.log(
                'Mocked Vivid_Standard_Blocks_Publication_View query intercepted'
            );

            // if query contains "outFields=Tag", return mocked response with 3 features with different tags, otherwise return empty features
            const url = route.request().url();
            if (url.includes('outFields=Tag&returnDistinctValues=true')) {
                console.log(
                    'intercepted query to fetch unique regions from Vivid_Standard_Blocks_Publication_View, returning mocked response with 3 unique regions'
                );
                return await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify(
                        MOCKED_UNIQUE_REGIONS_FOR_REGIONS_UPDATES
                    ),
                });
            }

            if (url.includes('eturnGeometry=false&returnExtentOnly=true')) {
                console.log(
                    'intercepted query to fetch extent from Vivid_Standard_Blocks_Publication_View, returning mocked response with extent'
                );
                return await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify(MOCKED_UPDATES_LAYER_EXTENT_RESPONSE),
                });
            }

            if (url.includes('outStatistics')) {
                console.log(
                    'intercepted query with outStatistics from Vivid_Standard_Blocks_Publication_View, returning mocked statistic response'
                );

                return await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify(
                        MOCKED_STATISTIC_RESPONSE_4_REGIONAL_UPDATES_ALL
                    ),
                });
            }
        }
    );

    await page.route(
        '**/rest/services/Community_Blocks_Publication_View/FeatureServer/0/query*',
        async (route) => {
            console.log(
                'Mocked Community_Blocks_Publication_View query intercepted'
            );

            // if query contains "outFields=Tag", return mocked response with 2 features with different tags, otherwise return empty features
            const url = route.request().url();
            if (url.includes('outFields=Tag&returnDistinctValues=true')) {
                console.log(
                    'intercepted query to fetch unique regions from Community_Blocks_Publication_View, returning mocked response with 2 unique regions'
                );
                return await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify(
                        MOCKED_UNIQUE_REGIONS_FOR_COMMUNITY_UPDATES
                    ),
                });
            }

            if (url.includes('eturnGeometry=false&returnExtentOnly=true')) {
                console.log(
                    'intercepted query to fetch extent from Community_Blocks_Publication_View, returning mocked response with extent'
                );
                return await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify(MOCKED_UPDATES_LAYER_EXTENT_RESPONSE),
                });
            }

            if (url.includes('outStatistics')) {
                console.log(
                    'intercepted query with outStatistics from Community_Blocks_Publication_View, returning mocked statistic response'
                );

                return await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify(
                        MOCKED_STATISTIC_RESPONSE_4_COMMUNITY_UPDATES_ALL
                    ),
                });
            }
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

    await page.unroute(
        '**/rest/services/Vivid_Advanced_Blocks_Publication_View/FeatureServer/0/query*'
    );

    await page.unroute(
        '**/rest/services/Vivid_Standard_Blocks_Publication_View/FeatureServer/0/query*'
    );

    await page.unroute(
        '**/rest/services/Community_Blocks_Publication_View/FeatureServer/0/query*'
    );
};
