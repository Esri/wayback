import { test, expect, Locator } from '@playwright/test';
import { DEV_SERVER_URL } from '../playwright.config';
import {
    mockNetworkRequests,
    resetMockedNetworkRequest,
} from '../helpers/mockNetworkRequests';

const TIMEOUT_LONG = 1000 * 30; // 30 seconds

test.describe('Wayback - Map Popup', () => {
    test('Verify Popup functionalities', async ({ page }) => {
        await mockNetworkRequests(page);

        // Navigate to the Explorer Mode page
        await page.goto(
            DEV_SERVER_URL + '/#mapCenter=-117.19462%2C34.05786%2C17'
        );

        // find map view container
        const mapViewContainer = page.getByTestId('map-view-container');
        const mapView = mapViewContainer.locator('div.esri-view-root');
        await expect(mapView).toBeVisible({
            timeout: TIMEOUT_LONG,
        });

        // Click on the map to open a popup
        await mapViewContainer.click({ position: { x: 300, y: 300 } });

        // Verify that the popup appears
        const popupContainer = page.getByTestId('popup-content');
        await expect(popupContainer).toBeVisible({
            timeout: TIMEOUT_LONG,
        });

        // verify it contains expected content
        await verifyPopupContent({
            popupContainer,
            provider: 'Nearmap',
            sourceDesc: 'Redlands, CA',
            acquisitionDate: 'May 1, 2024',
            sampRes: 0.05,
            srcAcc: 0.25,
        });

        // locate the close button and click it to close the popup
        const popupCloseButton = page.getByTestId('popup-close-button');
        await popupCloseButton.click();

        // Verify the popup is closed
        await expect(popupContainer).toBeHidden({
            timeout: TIMEOUT_LONG,
        });

        // Clean up mocked network requests
        await resetMockedNetworkRequest(page);
    });

    test('Verfiy Popup in Switch Mode', async ({ page }) => {
        await mockNetworkRequests(page);

        // Navigate to the Explorer Mode page
        await page.goto(
            DEV_SERVER_URL +
                '/#mapCenter=-117.19462%2C34.05786%2C17&&mode=swipe'
        );

        // find map view container
        const mapViewContainer = page.getByTestId('map-view-container');
        const mapView = mapViewContainer.locator('div.esri-view-root');
        await expect(mapView).toBeVisible({
            timeout: TIMEOUT_LONG,
        });

        // click on the left side of the swipe map to open a popup
        await mapViewContainer.click({ position: { x: 200, y: 300 } });

        // Verify that the popup appears
        const popupContainer = page.getByTestId('popup-content');
        await expect(popupContainer).toBeVisible({
            timeout: TIMEOUT_LONG,
        });

        // verify it contains expected content
        await verifyPopupContent({
            popupContainer,
            provider: 'Nearmap',
            sourceDesc: 'Redlands, CA',
            acquisitionDate: 'May 1, 2024',
            sampRes: 0.05,
            srcAcc: 0.25,
        });

        // find the close button and click it to close the popup
        const popupCloseButton = page.getByTestId('popup-close-button');
        await popupCloseButton.click();

        // Verify the popup is closed
        await expect(popupContainer).toBeHidden({
            timeout: TIMEOUT_LONG,
        });

        // get width of the map view container
        const mapViewBoundingBox = await mapView.boundingBox();
        if (!mapViewBoundingBox) {
            throw new Error('Failed to get map view bounding box');
        }
        // get width of the map view
        const mapViewWidth = mapViewBoundingBox.width;

        // get swipe position x (center + 50px), which is on the right side of the swipe map
        const swipePositionX = mapViewWidth / 2 + 50;

        // click on the right side of the swipe map to open a popup
        await mapViewContainer.click({
            position: { x: swipePositionX, y: 300 },
        });

        // Verify that the popup appears
        await expect(popupContainer).toBeVisible({
            timeout: TIMEOUT_LONG,
        });

        // verify it contains expected content
        await verifyPopupContent({
            popupContainer,
            provider: 'Microsoft',
            sourceDesc: 'UC-G',
            acquisitionDate: 'May 24, 2010',
            sampRes: 0.5,
            srcAcc: 4.25,
        });

        // Clean up mocked network requests
        await resetMockedNetworkRequest(page);
    });
});

/**
 * Verifies that the map popup container displays the expected imagery metadata content.
 *
 * This function checks that the popup is visible and contains formatted text for:
 * - Provider and source description with acquisition date
 * - Sample resolution information
 * - Source accuracy information
 *
 * @param params - The verification parameters
 * @param params.popupContainer - The Playwright Locator for the popup container
 * @param params.provider - The imagery provider name
 * @param params.sourceDesc - The source description
 * @param params.acquisitionDate - The acquisition date string
 * @param params.sampRes - Sample resolution in meters
 * @param params.srcAcc - Source accuracy in meters
 *
 * @returns A promise that resolves when all assertions pass
 *
 * @throws {AssertionError} If the popup is not visible or doesn't contain expected content
 */
const verifyPopupContent = async ({
    popupContainer,
    provider,
    sourceDesc,
    acquisitionDate,
    sampRes,
    srcAcc,
}: {
    /**
     * The Playwright Locator for the popup container.
     */
    popupContainer: Locator;
    /**
     * The imagery provider name.
     */
    provider: string;
    /**
     * The source description.
     */
    sourceDesc: string;
    /**
     * The acquisition date string.
     */
    acquisitionDate: string;
    /**
     * Sample resolution.
     */
    sampRes: number;
    /**
     * Source accuracy.
     */
    srcAcc: number;
}) => {
    await expect(popupContainer).toBeVisible({
        timeout: TIMEOUT_LONG,
    });
    // verify it contains expected content
    await expect(popupContainer).toContainText(
        `${provider} (${sourceDesc}) image captured on ${acquisitionDate}`
    );
    await expect(popupContainer).toContainText(
        `Pixels in the source image represent a ground distance of ${sampRes} meters`
    );
    await expect(popupContainer).toContainText(
        `Objects displayed in this image are within ${srcAcc} meters of true location`
    );
};
