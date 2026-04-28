const ENV_VARIABLES = [
    {
        name: 'APP_ID',
        required: true,
    },
    {
        name: 'WEBPACK_DEV_SERVER_HOSTNAME',
        required: false,
    },
    {
        name: 'ARCGIS_PORTAL_ROOT_URL',
        required: false,
    },
    {
        name: 'WAYBACK_CONFIG_FILE_URL',
        required: false,
    },
    {
        name: 'WAYBACK_SUBDOMAINS',
        required: false,
    },
    {
        name: 'WAYBACK_EXPORT_GP_SERVICE_ROOT_URL',
        required: false,
    },
    {
        name: 'METROPOLITAN_UPDATES_FEATURE_LAYER_URL',
        required: false,
    },
    {
        name: 'REGIONAL_UPDATES_FEATURE_LAYER_URL',
        required: false,
    },
    {
        name: 'COMMUNITY_UPDATES_FEATURE_LAYER_URL',
        required: false,
    },
    {
        name: 'WORLD_IMAGERY_BASEMAP_URL',
        required: false,
    },
];

module.exports = {
    ENV_VARIABLES,
};
