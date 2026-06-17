# End-to-End Testing for World Imagery Wayback App

End-to-end tests for the Wayback App ensure the functionality and reliability of key features.

## Prerequisites

Update the `.env.e2e` file in project root with these variables.

```sh
# Required: ArcGIS Online username for E2E tests
E2E_TEST_ARCGIS_ONLINE_USERNAME = your_username_here

# Required: ArcGIS Online password for E2E tests
E2E_TEST_ARCGIS_ONLINE_PASSWORD = your_password_here

# Required: Specifies the target tier for E2E tests
# It determines which npm script to use to start the development server (e.g., `npm run start:dev` or `npm run start:prod`).
# Values: dev | prod
E2E_TEST_TARGET_TIER = dev

# OPtional: Specify the hostname used by the Webpack development server.
# This value is utilized in end-to-end tests to connect to the development server.
# Ensure it matches the dev server host configuration in `webpack.config.js`.
# If not set, defaults to 'http://localhost:8080'.
WEBPACK_DEV_SERVER_HOSTNAME = custom.hostname.here
```

## Running the Tests

To run the end-to-end tests, use the following command:

```sh
npm run e2e
```

To run tests in headed mode (with browser UI), use:

```sh
npm run e2e:headed
```

To run a specific test file, use:

```sh
npx playwright test e2e-tests/tests/{file-name} --config e2e-tests/playwright.config.ts --headed --workers=1
```

## Test Explore Mode

### Running the Explore Tests

To run only the tests related to the **Explore** mode, use:

```sh
npx playwright test e2e-tests/tests/explore.spec.ts --config e2e-tests/playwright.config.ts --headed --workers=1
```

### Test Details

The `explore.spec.ts` file contains tests that verify the functionality of the "Explore" mode in the Wayback App. These tests include:

1. **Explorer Mode Button Verification**
    - Ensures the "Explore Mode" button is visible and active upon navigation to the page.

2. **Card List Validation**
    - Verifies the card list is visible and contains at least one card.
    - Confirms the first card in the list can be selected and becomes active.

3. **Preview Window Verification**
    - Checks that hovering over a card displays the preview window with the correct release number.

4. **Bar Chart Functionality**
    - Ensures the bar chart is visible and highlights bars corresponding to the selected cards.
    - Verifies the bar for the selected card is active and matches the release number.

5. **Interaction with Highlighted Bars**
    - Validates that hovering over a highlighted bar updates the preview window.
    - Confirms clicking a highlighted bar selects the corresponding card and updates the URL hash.

6. **URL Hash Validation**
    - Ensures the URL hash reflects the currently selected release.

7. **Toggle Local Changes**
    - Verifies the "Show Only Local Changes" toggle button is visible and functional.
    - Confirms that activating the toggle filters the card list to show only releases with local changes.
    - Validates that the card list updates correctly when the toggle is activated or deactivated.

## Test User Profile Dialog

### Running the User Profile Dialog Tests

To run only the tests related to the **User Profile Dialog**, use:

```sh
npx playwright test e2e-tests/tests/user-profile.spec.ts --config e2e-tests/playwright.config.ts --headed --workers=1
```

### Test Details

The `user-profile.spec.ts` file contains tests that verify the functionality of the User Profile Dialog in the Wayback App. These tests include:

1. **User Profile Button Visibility and Click**
    - Ensures the "User Profile" button is visible on the page.
    - Verifies the button can be clicked to open the Sign In page of ArcGIS Online.

2. **Sign In to ArcGIS Online**
    - Confirms the ability to sign in using the provided ArcGIS Online credentials.
    - Verifies the "User Profile" button reflects the signed-in state - user avatar icon or initials.

3. **User Profile Dialog Visibility**
    - Ensures the User Profile dialog is visible after clicking the button.
    - Verifies the dialog displays the correct user information, including the username link.

4. **Close Profile Dialog**
    - Confirms the "Close" button is visible and functional.
    - Verifies the dialog is hidden after clicking the "Close" button.

5. **Reopen User Profile Dialog**
    - Ensures the dialog can be reopened after being closed.
    - Verifies the dialog is visible again upon reopening.

6. **Sign Out Functionality**
    - Confirms the "Sign Out" button is visible and functional.
    - Verifies the dialog is closed after signing out.
    - Ensures the "User Profile" button reflects the signed-out state - anonymous user icon.

## Test Save as Webmap Functionalities

### Running the Save as Webmap Tests

To run only the tests related to the **Save as Webmap** functionalities, use:

```sh
npx playwright test e2e-tests/tests/save-as-webmap.spec.ts --config e2e-tests/playwright.config.ts --headed --workers=1
```

### Test Details

The `save-as-webmap.spec.ts` file contains a single end-to-end test that walks through the full "Save as Webmap" workflow in the Wayback App, covering:

1. **Save as Webmap Button Visibility**
    - Ensures the "Save as Webmap" button is visible on navigation to the Explorer Mode page.

2. **Sign In Prompt Before Selecting Items**
    - Confirms clicking "Save as Webmap" while signed out shows the "Sign In to Save Webmap" prompt.
    - Signs in using the provided ArcGIS Online credentials.

3. **Prompt to Select a Wayback Item**
    - Verifies the prompt to select a wayback item appears after signing in, since no item is selected yet.
    - Confirms clicking the prompt navigates back to the Explorer Mode card list.

4. **Selecting Wayback Items to Save**
    - Selects the first card and toggles its "add to webmap" button, verifying the `add release to web map` button state switches correctly when toggled on, off, and back on.
    - Selects a second card and toggles its "add to webmap" button on.
    - Confirms the selected items count indicator updates to "2".

5. **Webmap Layers List in the Save as Webmap Dialog**
    - Reopens the "Save as Webmap" dialog and verifies both selected items appear in the layer list.
    - Removes the first layer item via its remove button, confirming it disappears while the second remains, and the selected items count updates to "1".

6. **Webmap Title and Snippet Validation**
    - Confirms the title, snippet, and tags inputs and the "Create Wayback Webmap" button are enabled after removing a layer item.
    - Clears the title input and verifies the create button becomes disabled, then re-enabled once a title is entered.
    - Clears the snippet input and verifies the create button becomes disabled, then re-enabled once a snippet is entered.

7. **Create Wayback Webmap**
    - Confirms clicking the "Create Wayback Webmap" button creates the webmap successfully.
    - Verifies the "Open Wayback Map" button becomes visible after the webmap is created.

## Test Map Popup

### Running the Map Popup Tests

To run only the tests related to the **Map Popup**, use:

```sh
npx playwright test e2e-tests/tests/map-popup.spec.ts --config e2e-tests/playwright.config.ts --headed --workers=1
```

### Test Details

The `map-popup.spec.ts` file contains tests that verify the functionality of the Map Popup in the Wayback App. These tests include:

1. **Map Popup Visibility and Content Verification**
    - Navigates to the Explorer Mode.
    - Ensures the map view container is visible.
    - Clicks on the map to trigger a popup.
    - Verifies the popup appears with correct content including provider, source description, acquisition date, sampling resolution, and source accuracy.
    - Confirms the "Close" button is visible and functional.
    - Verifies the popup is hidden after clicking the "Close" button.

2. **Popup in Switch Mode**
    - Navigates to the Swipe Mode page.
    - Ensures the map view container is visible.
    - Clicks on the left side of the swipe map to open a popup.
    - Verifies the popup displays with expected content for the left side layer.
    - Clicks on the right side of the swipe map to open a popup.
    - Verifies the popup displays with different expected content for the right side layer.

## Test Updates Mode

### Running the Updates Mode Tests

To run only the tests related to the **Updates** mode, use:

```sh
npx playwright test e2e-tests/tests/updates-mode.spec.ts --config e2e-tests/playwright.config.ts --headed --workers=1
```
