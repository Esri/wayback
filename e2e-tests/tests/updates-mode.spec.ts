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
        // check the summary info is displayed with the correct statistics from the mocked response
        const summaryInfo = page.getByTestId('updates-mode-summary-info');

        // find the vivid-standard and community-contributed radio buttons and verify that they are not checked
        const vividStandardRadioButton = page.getByTestId(
            'category-filter-radio-button-vivid-standard'
        );
        await expect(vividStandardRadioButton).not.toHaveAttribute('checked');

        // click the vivid-standard radio button and verify that it is checked and the summary info is updated with the corresponding mocked statistics
        await vividStandardRadioButton.click();
        await expect(vividStandardRadioButton).toHaveAttribute('checked');
        await expect(summaryInfo).toHaveText(
            '999 published areas covering 90.0M km²'
        );

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
        await expect(summaryInfo).toHaveText(
            '333 published areas covering 30K km²'
        );

        // click back the vivid-advanced radio button and verify that it is checked and the summary info is updated with the corresponding mocked statistics
        await vividAdvancedRadioButton.click();
        await expect(vividAdvancedRadioButton).toHaveAttribute('checked');
        await expect(summaryInfo).toHaveText(
            '666 published areas covering 6.0M km²'
        );

        // Clean up mocked network requests
        await resetMockedNetworkRequest(page);
    });
});
