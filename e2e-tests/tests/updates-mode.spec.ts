import { test, expect } from '@playwright/test';
import {
    mockNetworkRequests,
    resetMockedNetworkRequest,
} from '../helpers/mockNetworkRequests';
import { signInWithArcGISOnline } from '../helpers/signInWithArcGISOnline';
import { DEFAULT_APP_URL } from './constants';

test.describe('Wayback - Updates Mode', () => {
    test('Updates Mode shows sign-in prompt for anonymous user and enables filters after authentication', async ({
        page,
    }) => {
        await mockNetworkRequests(page);

        // Navigate to the page
        await page.goto(DEFAULT_APP_URL);

        // set long timeout since the sign in process can be slow
        test.setTimeout(1000 * 60 * 2); // 2 minutes

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

        // by default, the category filter should be set to 'vivid-advanced', so verify that the corresponding radio button is checked
        const vividAdvancedRadioButton = page.getByTestId(
            'category-filter-radio-button-vivid-advanced'
        );
        await expect(vividAdvancedRadioButton).toHaveAttribute('checked');

        // // check the summary info is displayed with the correct statistics from the mocked response
        // const summaryInfo = page.getByTestId('updates-mode-summary-info');

        // find the vivid-standard and community-contributed radio buttons and verify that they are not checked
        const vividStandardRadioButton = page.getByTestId(
            'category-filter-radio-button-vivid-standard'
        );
        await expect(vividStandardRadioButton).not.toHaveAttribute('checked');

        // click the vivid-standard radio button and verify that it is checked and the summary info is updated with the corresponding mocked statistics
        await vividStandardRadioButton.click();
        await expect(vividStandardRadioButton).toHaveAttribute('checked');
        // await expect(summaryInfo).toHaveText(
        //     '999 published areas covering 90.0M km²', {
        //         timeout: 10 * 1000
        //     }
        // );

        // click the community-contributed radio button and verify that it is checked and the summary info is updated with the corresponding mocked statistics
        const communityContributedRadioButton = page.getByTestId(
            'category-filter-radio-button-community-contributed'
        );
        await expect(communityContributedRadioButton).not.toHaveAttribute(
            'checked'
        );
        await communityContributedRadioButton.click();
        await expect(communityContributedRadioButton).toHaveAttribute(
            'checked'
        );
        // await expect(summaryInfo).toHaveText(
        //     '333 published areas covering 30K km²', {
        //         timeout: 10 * 1000
        //     }
        // );

        // click back the vivid-advanced radio button and verify that it is checked and the summary info is updated with the corresponding mocked statistics
        await vividAdvancedRadioButton.click();
        await expect(vividAdvancedRadioButton).toHaveAttribute('checked');
        // await expect(summaryInfo).toHaveText(
        //     '666 published areas covering 6.0M km²', {
        //         timeout: 10 * 1000
        //     }
        // );

        // get region filters and verify that they are populated with the corresponding mocked unique regions for each category
        const regionFilter = page.getByTestId(
            'region-filter-options-container'
        );
        await expect(regionFilter).toBeVisible();

        // check the number of region options and make sure they match the mocked data
        await expect(regionFilter).toHaveAttribute('data-num-options', '5'); // we have 4 unique regions plus 1 option for 'All Regions'

        // region filter input
        const regionFilterInput = page
            .getByTestId('region-filter-search-input')
            .locator('input');
        await expect(regionFilterInput).toBeVisible();

        // type a search term into the region filter input and verify that the filtered options are displayed correctly
        await regionFilterInput.fill('United States');
        await expect(regionFilter).toHaveAttribute('data-num-options', '1'); // only 1 region matches 'US'

        // click the "United States" region option to select it and verify that the corresponding chip is displayed in the header of the region filter
        const usRegionOption = regionFilter.getByTestId(
            'region-filter-radio-button-US'
        );
        await expect(usRegionOption).toBeVisible();
        await usRegionOption.click();

        // check the chip for the selected region filter
        const selectedRegionChip = page.getByTestId('selected-region-name');
        await expect(selectedRegionChip).toBeVisible();
        await expect(selectedRegionChip).toHaveText('United States');

        // find the clear button on selected region chip and click it to clear the selected region filter, and verify that the chip is removed and the region options are reset to show all options
        const clearRegionFilterButton = page.getByTestId(
            'clear-selected-region-button'
        );
        await expect(clearRegionFilterButton).toBeVisible();
        await clearRegionFilterButton.click();
        await expect(selectedRegionChip).toBeHidden();
        await expect(regionFilter).toHaveAttribute('data-num-options', '5'); // all region options should be shown again

        // await page.pause();

        // Clean up mocked network requests
        await resetMockedNetworkRequest(page);
    });
});
