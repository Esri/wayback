const { ERROR_TERMIAL_OUTPUT_COLOR } = require("./constants");

/**
 * Get global constants to be defined in the webpack build process.
 * These constants are made available in the application code via webpack's DefinePlugin.
 * 
 * @param {*} envConfig object containing environment variables loaded from .env file by dotenv
 * @returns {Object} - object containing global constants to be defined in webpack
 */
const getGlobalConstants = (
    envConfig
)=>{

    if(!envConfig){
        console.error(
            ERROR_TERMIAL_OUTPUT_COLOR,
            'No environment configuration provided for global constants generation.'
        );
        process.exit(1);
    }

    console.log(`Generating global constants...\n`);

    return {
        // define environment variables to be used in the application
        APP_ID: JSON.stringify(envConfig.APP_ID),
        ENV_ARCGIS_PORTAL_ROOT_URL: JSON.stringify(envConfig.ARCGIS_PORTAL_ROOT_URL),
        ENV_WAYBACK_CONFIG_FILE_URL: JSON.stringify(envConfig.WAYBACK_CONFIG_FILE_URL),
        ENV_WAYBACK_SUBDOMAINS: JSON.stringify(envConfig.WAYBACK_SUBDOMAINS ? envConfig.WAYBACK_SUBDOMAINS.split(',').map(s => s.trim()) : undefined),
        ENV_WAYBACK_EXPORT_GP_SERVICE_ROOT_URL: JSON.stringify(envConfig.WAYBACK_EXPORT_GP_SERVICE_ROOT_URL),
        ENV_METROPOLITAN_UPDATES_FEATURE_LAYER_URL: JSON.stringify(envConfig.METROPOLITAN_UPDATES_FEATURE_LAYER_URL),
        ENV_REGIONAL_UPDATES_FEATURE_LAYER_URL: JSON.stringify(envConfig.REGIONAL_UPDATES_FEATURE_LAYER_URL),
        ENV_COMMUNITY_UPDATES_FEATURE_LAYER_URL: JSON.stringify(envConfig.COMMUNITY_UPDATES_FEATURE_LAYER_URL),
        ENV_WORLD_IMAGERY_BASEMAP_URL: JSON.stringify(envConfig.WORLD_IMAGERY_BASEMAP_URL),
    }
}

module.exports = getGlobalConstants;