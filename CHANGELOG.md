# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

