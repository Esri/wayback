import { test, expect } from '@playwright/test';
import { DEV_SERVER_URL } from '../playwright.config';
import {
    mockNetworkRequests,
    resetMockedNetworkRequest,
} from '../helpers/mockNetworkRequests';
import { signInWithArcGISOnline } from '../helpers/signInWithArcGISOnline';
import { DEFAULT_APP_URL } from './constants';

test.describe('Wayback - Save as Webmap', () => {
    test('Verify Save as Webmap functionalities', async ({ page }) => {
        await mockNetworkRequests(page);

        // Navigate to the Explorer Mode page
        await page.goto(DEFAULT_APP_URL);

        // set long timeout since the sign in process can be slow
        test.setTimeout(1000 * 60 * 2); // 2 minutes

        // locate the "Save as Webmap" button and verify it's visible, click it to open the save as webmap panel
        const saveAsWebmapButton = page.getByTestId('save-as-webmap-button');
        await expect(saveAsWebmapButton).toBeVisible();
        await saveAsWebmapButton.click();

        // by default, the sign in prompt should appear since the user is not signed in, so we can verify that first before signing in.
        const signInPrompt = page.getByTestId('sign-in-to-save-webmap-button');
        await expect(signInPrompt).toBeVisible();
        await signInPrompt.click();

        // Sign in to ArcGIS Online
        await signInWithArcGISOnline(page);

        // After user signed in, the prompt to select wayback items to save as webmap should appear since no wayback item is selected by default, so we can verify that as well.
        const promptToSelectWaybackItem = page.getByTestId(
            'prompt-to-select-wayback-item-to-save-as-webmap'
        );
        await expect(promptToSelectWaybackItem).toBeVisible();

        // click on the prompt to select wayback items should bring user back to the explorer mode
        await promptToSelectWaybackItem.click();

        const cardList = page.getByTestId('card-list');
        await expect(cardList).toBeVisible();

        // get the first card and click it to make it active, then click the toggle add to webmap button on the first card to select it to save as webmap
        const firstCard = cardList
            .locator('[data-testid^="list-card-"]')
            .nth(0);
        await expect(firstCard).toBeVisible();
        await firstCard.click();
        const releaseNum = await firstCard.getAttribute('data-release-num');

        // find the toggle add to webmap button on the first card and click it to select the first card to save as webmap
        const toggleAddToWebmapButton1 = page.getByTestId(
            `toggle-add-to-webmap-button-${releaseNum}`
        );
        await expect(toggleAddToWebmapButton1).toBeVisible();
        await expect(toggleAddToWebmapButton1).toHaveAttribute(
            'data-is-selected',
            'false'
        );
        await toggleAddToWebmapButton1.click();
        await expect(toggleAddToWebmapButton1).toHaveAttribute(
            'data-is-selected',
            'true'
        );

        // click the toggle add to webmap button on the first card again to unselect it, and verify the button state changes accordingly
        await toggleAddToWebmapButton1.click();
        await expect(toggleAddToWebmapButton1).toHaveAttribute(
            'data-is-selected',
            'false'
        );

        // click the toggle add to webmap button on the first card again to select it, and verify the button state changes accordingly
        await toggleAddToWebmapButton1.click();
        await expect(toggleAddToWebmapButton1).toHaveAttribute(
            'data-is-selected',
            'true'
        );

        // get the second card and click the toggle add to webmap button to select it as well
        const secondCard = cardList
            .locator('[data-testid^="list-card-"]')
            .nth(1);
        await expect(secondCard).toBeVisible();
        await secondCard.click();
        const releaseNum2 = await secondCard.getAttribute('data-release-num');

        // find the toggle add to webmap button on the second card and click it to select the second card to save as webmap, and verify the button state changes accordingly
        const toggleAddToWebmapButton2 = page.getByTestId(
            'toggle-add-to-webmap-button-' + releaseNum2
        );
        await expect(toggleAddToWebmapButton2).toBeVisible();
        await expect(toggleAddToWebmapButton2).toHaveAttribute(
            'data-is-selected',
            'false'
        );
        await toggleAddToWebmapButton2.click();
        await expect(toggleAddToWebmapButton2).toHaveAttribute(
            'data-is-selected',
            'true'
        );

        // Now we should have two wayback items selected to save as webmap, so we can verify that the count of selected items is correct
        const selectedItemsCount = page.getByTestId(
            'selected-wayback-items-count'
        );
        await expect(selectedItemsCount).toHaveText('2');

        // click on the "save as webmap" button to open the save as webmap dialog
        await saveAsWebmapButton.click();

        // layer list should be visible in the save as webmap dialog, and we can verify that the two selected wayback items are both listed in the layer list
        const webmapLayersList = page.getByTestId('webmap-layers-list');
        await expect(webmapLayersList).toBeVisible();

        const firstLayerItem = webmapLayersList.getByTestId(
            `webmap-layer-item-${releaseNum}`
        );
        await expect(firstLayerItem).toBeVisible();

        const secondLayerItem = webmapLayersList.getByTestId(
            `webmap-layer-item-${releaseNum2}`
        );
        await expect(secondLayerItem).toBeVisible();

        // click the remove button on the first layer item to remove it from the layer list, and verify that the first layer item is removed while the second layer item is still there
        const removeButton1 = firstLayerItem.getByTestId(
            `remove-webmap-layer-button-${releaseNum}`
        );
        await expect(removeButton1).toBeVisible();
        await removeButton1.click();
        await expect(firstLayerItem).not.toBeVisible();
        await expect(secondLayerItem).toBeVisible();

        // check the item count after removing one layer item, it should be 1 now
        await expect(selectedItemsCount).toHaveText('1');

        // make sure the input fields and the create button are enabled after removing one layer item
        const webmapTitleInput = page
            .getByTestId('webmap-title-input')
            .locator('input');
        const webmapSnippetInput = page
            .getByTestId('webmap-snippet-input')
            .locator('input');
        const webmapTagsInput = page.getByTestId('webmap-tags-input');
        const createWaybackWebmapButton = page.getByTestId(
            'create-wayback-webmap-button'
        );

        await expect(webmapTitleInput).toBeEnabled();
        await expect(webmapSnippetInput).toBeEnabled();
        await expect(webmapTagsInput).toBeEnabled();
        await expect(createWaybackWebmapButton).toBeEnabled();

        // remove the title input to make the required field missing, and verify that the create button is disabled
        await webmapTitleInput.fill('');
        await expect(createWaybackWebmapButton).toHaveAttribute('disabled');

        // fill in the title input, and verify that the create button is enabled
        await webmapTitleInput.fill('My Wayback Webmap');
        await expect(createWaybackWebmapButton).toBeEnabled();

        // remove the snippet input, and verify that the create button is disabled since snippet is also a required field
        await webmapSnippetInput.fill('');
        await expect(createWaybackWebmapButton).toHaveAttribute('disabled');

        // fill in the snippet input, and verify that the create button is still enabled
        await webmapSnippetInput.fill(
            'This is a webmap created by wayback app.'
        );
        await expect(createWaybackWebmapButton).toBeEnabled();

        // Click the "Create as Webmap" button
        await createWaybackWebmapButton.click();

        // find the "open-wayback-webmap-button" and verify it's visible, then click it to open the created webmap
        const openWaybackWebmapButton = page.getByTestId(
            'open-wayback-webmap-button'
        );
        await expect(openWaybackWebmapButton).toBeVisible();

        // // verify that the Save as Webmap dialog appears
        // const saveAsWebmapDialogContent = page.getByTestId(
        //     'save-as-webmap-dialog-content'
        // );
        // await expect(saveAsWebmapDialogContent).toBeVisible();

        // // Verify that the "Sign In to Save Webmap" button is visible
        // const signInToSaveWebmapButton = page.getByTestId(
        //     'sign-in-to-save-webmap-button'
        // );
        // await expect(signInToSaveWebmapButton).toBeVisible();

        // // verify that the "Create Wayback Webmap" button is visible but disabled
        // const createWaybackWebmapButton = page.getByTestId(
        //     'create-wayback-webmap-button'
        // );
        // await expect(createWaybackWebmapButton).toBeVisible();
        // await expect(createWaybackWebmapButton).toHaveAttribute('disabled');

        // // click the "Sign In to Save Webmap" button
        // await signInToSaveWebmapButton.click();

        // // perform sign in with ArcGIS Online
        // await signInWithArcGISOnline(page);

        // // verify the Save as Webmap dialog is still visible after sign in
        // await expect(saveAsWebmapDialogContent).toBeVisible();

        // // verify that the "Create Wayback Webmap" button is now enabled
        // await expect(createWaybackWebmapButton).toBeEnabled();

        // // remove the title input to make the required field missing
        // const webmapTitleInput = page.getByTestId('webmap-title-input');
        // await webmapTitleInput.fill('');

        // // verify that the "Create Wayback Webmap" button is disabled
        // await expect(createWaybackWebmapButton).toHaveAttribute('disabled');

        // // fill in the title input
        // await webmapTitleInput.fill('My Wayback Webmap');

        // // verify that the "Create Wayback Webmap" button is enabled
        // await expect(createWaybackWebmapButton).toBeEnabled();

        // // click the "Create Wayback Webmap" button
        // await createWaybackWebmapButton.click();

        // // verify that the "Open Wayback Map" button is visible
        // const openWaybackWebmapButton = page.getByTestId(
        //     'open-wayback-webmap-button'
        // );
        // await expect(openWaybackWebmapButton).toBeVisible();

        await resetMockedNetworkRequest(page);
    });
});
