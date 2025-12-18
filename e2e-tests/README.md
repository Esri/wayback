# End-to-End Testing for World Imagery Wayback App

End-to-end tests for the Wayback App ensure the functionality and reliability of key features.

## Prerequisites
Update the `.env.e2e` file in project root with these variables.

```sh
# Required: ArcGIS Online username for E2E tests
E2E_TEST_ARCGIS_ONLINE_USERNAME = your_username_here

# Required: ArcGIS Online password for E2E tests
E2E_TEST_ARCGIS_ONLINE_PASSWORD = your_password_here

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
The `save-as-webmap.spec.ts` file contains tests that verify the functionality of the "Save as Webmap" feature in the Wayback App. These tests include:

1. **Save as Webmap Button Initial State**
    - Ensures the "Save as Webmap" button is visible but initially disabled.

2. **Card Selection and Save as Webmap Button Activation**
    - Verifies that activating/hovering a card enables the "Save as Webmap" button.
    - Confirms the selected items count indicator at bottom right side of the "Save as Webmap" button updates correctly when items are added or removed.

3. **Clear All Selected Items**
    - Ensures the "Clear All" button clears all selected items.
    - Verifies the "Save as Webmap" button is disabled after clearing all selections.

4. **Save as Webmap Dialog Visibility**
    - Confirms the "Save as Webmap" dialog appears after clicking the "Save as Webmap" button.

5. **Sign In to Save Webmap**
    - Verifies the "Sign In to Save Webmap" button is visible and functional.
    - Confirms the ability to sign in using ArcGIS Online credentials.
    - Ensures the "Create Wayback Webmap" button becomes enabled after signing in.

6. **Webmap Title Validation**
    - Ensures the "Create Wayback Webmap" button is disabled when the title input is empty.
    - Verifies the button becomes enabled after entering a valid title.

7. **Create Wayback Webmap**
    - Confirms the "Create Wayback Webmap" button creates the webmap successfully.
    - Verifies the "Open Wayback Map" button is visible after the webmap is created.

