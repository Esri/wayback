const { logErrorAndExit } = require('./helpers');
const path = require('path');
const fs = require('fs');

/**
 * Parse comma-separated subdomain string into an array of valid subdomain names.
 * Handles empty strings, whitespace, and filters out invalid entries.
 * @param {string} subdomainString - comma-separated string of subdomain names
 * @returns {string[] | undefined} - array of valid subdomain names, or undefined if none are valid
 */
const parseSubdomains = (subdomainString) => {
    // Handle empty or whitespace-only strings
    if (!subdomainString || !subdomainString.trim()) {
        return undefined;
    }

    // Split, trim, and filter out empty strings
    const subdomains = subdomainString
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

    // Return undefined if no valid subdomains remain after filtering
    return subdomains.length > 0 ? subdomains : undefined;
};

/**
 * Get the list of supported languages by checking the i18n directory for subdirectories
 * that contain a common.json file.
 * @returns {string[]} - array of supported language codes that match the subdirectory names. (e.g., `['en', 'es', 'zh']`)
 */
const getSupportedLanguages = () => {
    const i18nDir = path.resolve(__dirname, '../public/i18n');
    const subdirs = fs
        .readdirSync(i18nDir, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name);

    // if sub dir contains common.json file, consider it as a supported language
    const supportedLanguages = subdirs.filter((lang) => {
        const commonJsonPath = path.join(i18nDir, lang, 'common.json');
        return fs.existsSync(commonJsonPath);
    });

    if (supportedLanguages.length === 0) {
        logErrorAndExit(
            'No supported languages found in i18n directory.\nPlease ensure that the i18n directory contains subdirectories for each supported language with a common.json file.'
        );
    }

    return supportedLanguages;
};

/**
 * Get global constants to be defined in the webpack build process.
 * These constants are made available in the application code via webpack's DefinePlugin.
 *
 * @param {*} envConfig object containing environment variables loaded from .env file by dotenv
 * @returns {Object} - object containing global constants to be defined in webpack
 */
const getGlobalConstants = (envConfig) => {
    if (!envConfig) {
        logErrorAndExit(
            'No environment configuration provided for global constants generation.'
        );
    }

    console.log(`Generating global constants...`);

    const supportedLanguages = getSupportedLanguages();
    console.log(`Supported languages: ${supportedLanguages.join(', ')}\n`);

    return {
        // define environment variables to be used in the application
        APP_ID: JSON.stringify(envConfig.APP_ID),
        ENV_ARCGIS_PORTAL_ROOT_URL: JSON.stringify(
            envConfig.ARCGIS_PORTAL_ROOT_URL
        ),
        ENV_WAYBACK_CONFIG_FILE_URL: JSON.stringify(
            envConfig.WAYBACK_CONFIG_FILE_URL
        ),
        ENV_WAYBACK_SUBDOMAINS: JSON.stringify(
            parseSubdomains(envConfig.WAYBACK_SUBDOMAINS)
        ),
        ENV_WAYBACK_EXPORT_GP_SERVICE_ROOT_URL: JSON.stringify(
            envConfig.WAYBACK_EXPORT_GP_SERVICE_ROOT_URL
        ),
        ENV_METROPOLITAN_UPDATES_FEATURE_LAYER_URL: JSON.stringify(
            envConfig.METROPOLITAN_UPDATES_FEATURE_LAYER_URL
        ),
        ENV_REGIONAL_UPDATES_FEATURE_LAYER_URL: JSON.stringify(
            envConfig.REGIONAL_UPDATES_FEATURE_LAYER_URL
        ),
        ENV_COMMUNITY_UPDATES_FEATURE_LAYER_URL: JSON.stringify(
            envConfig.COMMUNITY_UPDATES_FEATURE_LAYER_URL
        ),
        ENV_WORLD_IMAGERY_BASEMAP_URL: JSON.stringify(
            envConfig.WORLD_IMAGERY_BASEMAP_URL
        ),
        ENV_SUPPORTED_LANGUAGES: JSON.stringify(
            supportedLanguages && supportedLanguages?.length
                ? supportedLanguages
                : undefined
        ),
    };
};

module.exports = getGlobalConstants;
