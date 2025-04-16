import { test, expect } from '@playwright/test';
import { DEV_SERVER_URL } from '../playwright.config';

test('has title', async ({ page }) => {
    await page.goto(DEV_SERVER_URL);

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/World Imagery Wayback/);
});
