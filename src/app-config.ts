import { IAppConfig } from './types';

const config: IAppConfig = {
    // The registered application id used for authentication, this appId below only works for the app hosted on arcgis.com domain
    appId: 'WaybackImagery',
    shouldUseWaybackFootprintsLayer: false,
    // if on-premises is true, some functionalities (share app to social media and etc) will be disabled
    onPremises: false,
    productionEnv: {
        serviceUrls: {
            'portal-url': 'https://www.arcgis.com',
            'wayback-imagery-base':
                'https://wayback.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/MapServer',
            'wayback-config':
                'https://s3-us-west-2.amazonaws.com/config.maptiles.arcgis.com/waybackconfig.json',
            'wayback-change-detector-layer':
                'https://metadatadev.maptiles.arcgis.com/arcgis/rest/services/Wayback_Footprints/MapServer/0',
            // the vector tile layer provides a detailed reference layer, including transporation and labels for the world.
            'reference-layer':
                'https://www.arcgis.com/sharing/rest/content/items/2a2e806e6e654ea78ecb705149ceae9f/resources/styles/root.json',
            // this world imagery basemap will be used when user saves selected Wayback items into a new webmap
            'world-imagery-basemap':
                'https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/',
            'wayback-export-base': '',
        },
    },
    // The dev enivornment is optional, please comment out the dev section below if don't need the dev enivornment
    developmentEnv: {
        serviceUrls: {
            'portal-url': 'https://devext.arcgis.com',
            'wayback-imagery-base':
                'https://waybackdev.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/MapServer',
            'wayback-config':
                'https://s3-us-west-2.amazonaws.com/config.maptiles.arcgis.com/dev/waybackconfig.json',
            'wayback-change-detector-layer':
                'https://metadatadev.maptiles.arcgis.com/arcgis/rest/services/Wayback_Footprints/MapServer/0',
            'reference-layer':
                'https://devext.arcgis.com/sharing/rest/content/items/2155f4cadf454b9a973b12dc73d1ffaf/resources/styles/root.json?f=pjson',
            'world-imagery-basemap':
                'https://servicesdev.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/',
            'wayback-export-base':
                'https://34.220.147.218:6443/arcgis/rest/services/Wayport/GPServer/Wayport',
        },
    },
    defaultMapExtent: {
        xmin: -115.332,
        ymin: 36.048,
        xmax: -115.265,
        ymax: 36.08,
        spatialReference: {
            wkid: 4326,
        },
    },
};

export default config;
