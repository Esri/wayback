import { test, expect } from '@playwright/test';
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
        await expect(popupContainer).toContainText(
            /Nearmap \(Redlands, CA\) image captured on May 1, 2024/i
        );
        await expect(popupContainer).toContainText(
            /Pixels in the source image represent a ground distance of 0.05 meters/i
        );
        await expect(popupContainer).toContainText(
            /Objects displayed in this image are within 0.25 meters of true location/i
        );

        // Clean up mocked network requests
        await resetMockedNetworkRequest(page);
    });
});
