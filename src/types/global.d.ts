/**
 * The App ID used for authentication in the application.
 * This ID is defined in the environment variables.
 */
declare const APP_ID: string;

/**
 * Optional: Portal root URL for ArcGIS Online/Enterprise.
 * Defaults to https://www.arcgis.com if not specified.
 */
declare const ENV_ARCGIS_PORTAL_ROOT_URL: string;

/**
 * Optional: Custom URL for fetching the Wayback configuration file.
 * Defaults to https://s3-us-west-2.amazonaws.com/config.maptiles.arcgis.com/waybackconfig.json if not specified.
 */
declare const ENV_WAYBACK_CONFIG_FILE_URL: string;

/**
 * Optional: Wayback Export GP Service Root URL.
 * Defaults to https://wayport.maptiles.arcgis.com/arcgis/rest/services/Wayport/GPServer/Wayport if not specified.
 */
declare const ENV_WAYBACK_EXPORT_GP_SERVICE_ROOT_URL: string;

/**
 * Optional: URL of feature layer providing updates for metropolitan areas.
 * Defaults to https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/Vivid_Advanced_Blocks_Publication_View/FeatureServer/0 if not specified.
 */
declare const ENV_METROPOLITAN_UPDATES_FEATURE_LAYER_URL: string;

/**
 * Optional: URL of feature layer providing updates for regional areas.
 * Defaults to https://servicesdev.arcgis.com/VLx4vrvwONglS8iz/arcgis/rest/services/Vivid_Standard_Blocks_Publication_View/FeatureServer/0 if not specified.
 */
declare const ENV_REGIONAL_UPDATES_FEATURE_LAYER_URL: string;

/**
 * Optional: URL of feature layer providing community contributed updates.
 * Defaults to https://servicesdev.arcgis.com/VLx4vrvwONglS8iz/arcgis/rest/services/Community_Blocks_Simple_Publication_View/FeatureServer/0 if not specified.
 */
declare const ENV_COMMUNITY_UPDATES_FEATURE_LAYER_URL: string;

/**
 * Optional: Base URL for the World Imagery basemap service.
 * Defaults to https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/ if not specified.
 */
declare const ENV_WORLD_IMAGERY_BASEMAP_URL: string;
