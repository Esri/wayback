import { test, expect } from '@playwright/test';
import { DEV_SERVER_URL } from '../playwright.config';
import {
    mockNetworkRequests,
    resetMockedNetworkRequest,
} from '../helpers/mockNetworkRequests';
import { signInWithArcGISOnline } from '../helpers/signInWithArcGISOnline';

test.describe('Wayback - Save as Webmap', () => {
    test('Verify Save as Webmap functionalities', async ({ page }) => {
        await mockNetworkRequests(page);

        // Navigate to the Explorer Mode page
        await page.goto(
            DEV_SERVER_URL + '/#mapCenter=-117.19462%2C34.05786%2C17'
        );

        // set long timeout since the sign in process can be slow
        test.setTimeout(1000 * 60 * 2); // 2 minutes

        // Locate the "Save as Webmap" button
        const saveAsWebmapButton = page.getByTestId('save-as-webmap-button');

        // Verify that the "Save as Webmap" button is initially disabled
        await expect(saveAsWebmapButton).toBeDisabled();

        // Locate all cards in the list
        const listCards = page.locator('[data-testid^="list-card-"]');

        // Get the first and second card from the list
        const firstCard = listCards.nth(0);
        const secondCard = listCards.nth(1);

        // Wait for at least two cards to be visible
        await expect(firstCard).toBeVisible({ timeout: 10000 });
        await expect(secondCard).toBeVisible();

        // Click the first card to ensure it's active
        // active card has the "add to webmap" button visible
        await firstCard.click();

        // Click the "Add to Webmap" button on the first card
        const firstCardReleaseNum =
            (await firstCard.getAttribute('data-release-num')) || '';
        const firstCardAddToWebmapButton = firstCard.getByTestId(
            `toggle-add-to-webmap-button-${firstCardReleaseNum}`
        );

        await firstCardAddToWebmapButton.click();

        // Verify that the "Save as Webmap" button is now enabled
        await expect(saveAsWebmapButton).toBeEnabled();

        // Check that the selected wayback items count is 1
        const selectedItemsCount = page.getByTestId(
            'selected-wayback-items-count'
        );
        await expect(selectedItemsCount).toHaveText('1');

        // hover over the second card to reveal the "Add to Webmap" button
        await secondCard.hover();

        // Click the "Add to Webmap" button on the second card
        const secondCardReleaseNum =
            (await secondCard.getAttribute('data-release-num')) || '';
        const secondCardAddToWebmapButton = secondCard.getByTestId(
            `toggle-add-to-webmap-button-${secondCardReleaseNum}`
        );
        await secondCardAddToWebmapButton.click();

        // Check that the selected wayback items count is 2
        await expect(selectedItemsCount).toHaveText('2');

        // Click the "Clear All" button
        const clearAllButton = page.getByTestId(
            'clear-all-selected-items-button'
        );
        await clearAllButton.click();

        // Verify that the selected wayback items count is no longer visible
        await expect(selectedItemsCount).not.toBeVisible();

        // Verify that the "Save as Webmap" button is disabled
        await expect(saveAsWebmapButton).toBeDisabled();

        // select the first card again
        await firstCardAddToWebmapButton.click();
        await expect(saveAsWebmapButton).toBeEnabled();

        // Click the "Save as Webmap" button
        await saveAsWebmapButton.click();

        // verify that the Save as Webmap dialog appears
        const saveAsWebmapDialogContent = page.getByTestId(
            'save-as-webmap-dialog-content'
        );
        await expect(saveAsWebmapDialogContent).toBeVisible();

        // Verify that the "Sign In to Save Webmap" button is visible
        const signInToSaveWebmapButton = page.getByTestId(
            'sign-in-to-save-webmap-button'
        );
        await expect(signInToSaveWebmapButton).toBeVisible();

        // verify that the "Create Wayback Webmap" button is visible but disabled
        const createWaybackWebmapButton = page.getByTestId(
            'create-wayback-webmap-button'
        );
        await expect(createWaybackWebmapButton).toBeVisible();
        await expect(createWaybackWebmapButton).toHaveAttribute('disabled');

        // click the "Sign In to Save Webmap" button
        await signInToSaveWebmapButton.click();

        // perform sign in with ArcGIS Online
        await signInWithArcGISOnline(page);

        // verify the Save as Webmap dialog is still visible after sign in
        await expect(saveAsWebmapDialogContent).toBeVisible();

        // verify that the "Create Wayback Webmap" button is now enabled
        await expect(createWaybackWebmapButton).toBeEnabled();

        // remove the title input to make the required field missing
        const webmapTitleInput = page.getByTestId('webmap-title-input');
        await webmapTitleInput.fill('');

        // verify that the "Create Wayback Webmap" button is disabled
        await expect(createWaybackWebmapButton).toHaveAttribute('disabled');

        // fill in the title input
        await webmapTitleInput.fill('My Wayback Webmap');

        // verify that the "Create Wayback Webmap" button is enabled
        await expect(createWaybackWebmapButton).toBeEnabled();

        // click the "Create Wayback Webmap" button
        await createWaybackWebmapButton.click();

        // verify that the "Open Wayback Map" button is visible
        const openWaybackWebmapButton = page.getByTestId(
            'open-wayback-webmap-button'
        );
        await expect(openWaybackWebmapButton).toBeVisible();

        await resetMockedNetworkRequest(page);
    });
});
