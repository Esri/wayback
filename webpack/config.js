const ENV_VARIABLES = [
    {
        name: 'APP_ID',
        required: true,
        description:
            "App Id for the application. Required for authenticating with ArcGIS services for functionality like saving web maps and exploring the update layers. Replace with your actual ArcGIS OAuth Client ID. More details: https://developers.arcgis.com/documentation/security-and-authentication/user-authentication/how-to-implement-user-authentication/",
    },
    {
        name: 'WEBPACK_DEV_SERVER_HOSTNAME',
        required: false,
        description: 'Custom hostname for starting the Webpack Dev server.'
    },
    {
        name: 'ARCGIS_PORTAL_ROOT_URL',
        required: false,
        description: 'Portal root URL for ArcGIS Online/Enterprise.'
    },
    {
        name: 'WAYBACK_CONFIG_FILE_URL',
        required: false,
        description:
            'Custom URL for fetching the Wayback configuration file.'
    },
    {
        name: 'WAYBACK_SUBDOMAINS',
        required: false,
        description:
            'Comma-separated list of subdomains for the Wayback tile service.'
    },
    {
        name: 'WAYBACK_EXPORT_GP_SERVICE_ROOT_URL',
        required: false,
        description: 'Wayback Export GP Service Root URL.'
    },
    {
        name: 'METROPOLITAN_UPDATES_FEATURE_LAYER_URL',
        required: false,
        description:
            'URL of feature layer providing updates for metropolitan areas.'
    },
    {
        name: 'REGIONAL_UPDATES_FEATURE_LAYER_URL',
        required: false,
        description:
            'URL of feature layer providing updates for regional areas.'
    },
    {
        name: 'COMMUNITY_UPDATES_FEATURE_LAYER_URL',
        required: false,
        description:
            'URL of feature layer providing community contributed updates.'
    },
    {
        name: 'WORLD_IMAGERY_BASEMAP_URL',
        required: false,
        description: 'Base URL for the World Imagery basemap service.'
    },
];

module.exports = {
    ENV_VARIABLES,
};
