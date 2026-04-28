# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### Added
- Add Locale Switcher dialog to allow users to change the app's language.
- Add Locale Suggestion component to prompt users to switch to their browser's language if it matches a supported locale.

### Changed

## 2026-04-28

### Added
- Added a screenshot capture tool.
- Added the Scale, Zoom Level, and Pixel Size indicator to the map.
- Added end-to-end tests for multiple features using Playwright.
- Added Dishui Lake, Shanghai to interesting places list.

### Changed
- Enhanced the Export Tile Package mode:
    - Added support to save the wayback tile package as a hosted imagery layer in ArcGIS Online.
    - Added an extent selection tool to the map, allowing users to specify the area for tile package export.
    - Added a support to track the progress of tile package export jobs and display the status in the UI.
    - Replaced the dialog with a dedicated panel for export controls, offering greater flexibility and a better user experience.
    - Added a preview window showing example tile images at a given zoom level.
    - Improved status tracking logic to provide more accurate and granular updates for export jobs, giving users clearer feedback on progress.
    - Saved export job history to IndexedDB and displayed it in the panel, allowing users to track jobs and easily access exported tile packages.
- Enhanced the Save as a Web Map mode:
    - Added a list of selected versions in the Save as Web Map panel, allowing users to review and manage versions before saving.
    - Moved the Save as Web Map controls to a dedicated panel for a better user experience, also allowing users to adjust the web map extent using the map.
- Enhanced the Updates mode:
    - Combined the Status and Publication Date filters into a single filter with multiple options, making it easier to filter updates by different criteria.
    - Updated the Region filter to display normalized region names based on country and region codes, replacing inconsistent labels from the feature service.
    - Updated the style of the Updates layer to improve visibility in certain parts of the world.
- Reorganized the mode control buttons in the gutter for a cleaner, more consistent experience across different modes.
- Updated the About this App dialog.
- Moved strings from React components to i18next translation files for better internationalization support.
- Slightly increased the size of the wayback preview window for better visibility.
- Removed the Settings dialog and related code.
- Updated TypeScript to version 5.9.3 and updated its configuration.
- Updated `@arcgis/core` to version 4.34 and adjusted the CSS import path.
- Improved webpack configuration to better handle loading of environment variables and other app-specific settings; moved webpack-related code into a dedicated `webpack` directory for better organization.

## 2025-10-28

### Changed

- Enhanced the animation controls by adding the download and copy link buttons to the animation controls.
- Show reference layer in animation mode if it is turned on.
- Integrated the reference layer screenshot into output animation MP4 video.
- Updated the animation mode behavior to not automatically start playing when entering animation mode.

## 2025-10-06

### Added

- Added a **User Profile** dialog that allows signed-in users to view and manage their account details.
- Introduced an **IndexedDBLogger** to store log messages in IndexedDB for improved debugging and error tracking.

### Changed

- Updated the **App UI** to always display the left-side gutter with action buttons, allowing users to easily switch modes and access the User Profile dialog.
- Optimized **Updates Mode** performance through improved data fetching and caching strategies.
- Enhanced the **sign-in experience** by providing sign-in links instead of automatically prompting users to sign in.
- Improved **configuration management** by loading settings from the `.env` file instead of hardcoding them in the source code.
- Migrated `wayback-core` to use the new `@esri/wayback-core` package, replacing the deprecated `@vannizhang/wayback-core`.
- Enhanced **accessibility** with ARIA labels, keyboard navigation support, and more semantic HTML elements.

### Fixed

### Removed

## 2025-06-17

### Added

- Introduced Updates Mode to explore World Imagery updates from the past 12 months and view pending updates for the next 12 months.
- Added internationalization support using i18next.

### Changed

- Default app location now selects a random entry from the list of interesting places.
- Migrated to `calcite-components-react` and upgraded to `calcite-components` v3.1.0.
- Updated React components to use typed Calcite components from `calcite-components-react`.
- Refined side panel layout and styles.
- Simplified the app configuration file by removing unnecessary settings.

### Fixed

### Removed

## 2025-02-20

### Added

- Introduced a Locale Switch component for changing the Reference Layer's language.
- Added a notification message to inform users when a Reference Layer is available in their selected locale.

## 2024-10-04

### Fixed

- animation mode should be turned on when `animationSpeed=0` is in the URL hash params.

### Changed

- upgrade `calcite-components` to version 2.13

## 2024-09-09

### Changed

- upgrade `wayback-core` to version 1.0.8.
- update `getWaybackLayer` to use sub domains to speed up tile retrieval.
