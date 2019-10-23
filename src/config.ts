export default {
    // The registered application id used for authentication
    'appId': 'WaybackImagery',
    'shouldUseWaybackFootprintsLayer': false,
    'dev': {
        'portal-url': 'https://devext.arcgis.com',
        'wayback-imagery-base': 'https://waybackdev.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/MapServer',
        'wayback-config': 'https://s3-us-west-2.amazonaws.com/config.maptiles.arcgis.com/dev/waybackconfig.json',
        'wayback-change-detector-layer': 'https://metadatadev.maptiles.arcgis.com/arcgis/rest/services/Wayback_Footprints/MapServer/0'
    },
    'prod': {
        'portal-url': 'https://www.arcgis.com',
        'wayback-imagery-base': 'https://wayback.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/MapServer',
        'wayback-config': 'https://s3-us-west-2.amazonaws.com/config.maptiles.arcgis.com/waybackconfig.json',
        'wayback-change-detector-layer': 'https://metadatadev.maptiles.arcgis.com/arcgis/rest/services/Wayback_Footprints/MapServer/0'
    }
}