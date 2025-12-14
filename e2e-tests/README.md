# End-to-End Testing for World Imagery Wayback App

End-to-end tests for the Wayback App ensure the functionality and reliability of key features.

## Prerequisites
Update the `.env.e2e` file in project root with these variables.

```sh
#--------------------------------------------------------
# DEVELOPMENT SERVER CONFIGURATION
#--------------------------------------------------------

# Required: Webpack Dev Server Hostname
# Specify the hostname used by the Webpack development server.
# This value is utilized in end-to-end tests to connect to the development server.
# Ensure it matches the configuration in `webpack.config.js`.
WEBPACK_DEV_SERVER_HOSTNAME = custom.hostname.here

#--------------------------------------------------------
# CONFIGURATION FOR END-TO-END TESTS
#--------------------------------------------------------

# Required: ArcGIS Online username for E2E tests
E2E_TEST_ARCGIS_ONLINE_USERNAME = your_username_here

# Required: ArcGIS Online password for E2E tests
E2E_TEST_ARCGIS_ONLINE_PASSWORD = your_password_here
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