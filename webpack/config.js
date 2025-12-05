const ENV_VARIABLES = [
    {
        name: 'APP_ID',
        required: true,
        default: ''
    },
    {
        name: 'WEBPACK_DEV_SERVER_HOSTNAME',
        required: false,
        default: 'localhost'
    },
    {
        name: 'ARCGIS_PORTAL_ROOT_URL',
        required: false,
        default: 'https://www.arcgis.com'
    },
    {
        name: 'WAYBACK_CONFIG_FILE_URL',
        required: false,
        default: 'https://s3-us-west-2.amazonaws.com/config.maptiles.arcgis.com/waybackconfig.json'
    },
    {
        name: 'WAYBACK_SUBDOMAINS',
        required: false,
        default: 'wayback,waback-a,wayback-b'
    },
    {
        name: 'WAYBACK_EXPORT_GP_SERVICE_ROOT_URL',
        required: false,
        default: 'https://wayport.maptiles.arcgis.com/arcgis/rest/services/Wayport/GPServer/Wayport'
    },
    {
        name: 'METROPOLITAN_UPDATES_FEATURE_LAYER_URL',
        required: false,
        default: 'https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/Vivid_Advanced_Blocks_Publication_View/FeatureServer/0'
    },
    {
        name: 'REGIONAL_UPDATES_FEATURE_LAYER_URL',
        required: false,
        default: 'https://servicesdev.arcgis.com/VLx4vrvwONglS8iz/arcgis/rest/services/Vivid_Standard_Blocks_Publication_View/FeatureServer/0'
    },
    {
        name: 'COMMUNITY_UPDATES_FEATURE_LAYER_URL',
        required: false,
        default: 'https://servicesdev.arcgis.com/VLx4vrvwONglS8iz/arcgis/rest/services/Community_Blocks_Simple_Publication_View/FeatureServer/0'
    },
    {
        name: 'WORLD_IMAGERY_BASEMAP_URL',
        required: false,
        default: 'https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/'
    }
]

module.exports = {
    ENV_VARIABLES
};