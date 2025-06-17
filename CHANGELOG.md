# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

### Changed

### Fixed

### Removed

## [2025-06-17]

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

## [2024-10-04]

### Fixed
- animation mode should be turned on when `animationSpeed=0` is in the URL hash params.

### Changed
- upgrade `calcite-components` to version 2.13

## [2024-09-09]

### Changed
- upgrade `wayback-core` to version 1.0.8.
- update `getWaybackLayer` to use sub domains to speed up tile retrieval.

