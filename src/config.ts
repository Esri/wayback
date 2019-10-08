export default {
    // The registered application id used for authentication
    'appId': 'WaybackImagery',
    'dev': {
        'portal-url': 'https://devext.arcgis.com',
        'wayback-imagery-base': 'https://waybackdev.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/MapServer',
        'wayback-config': 'https://s3-us-west-2.amazonaws.com/config.maptiles.arcgis.com/dev/waybackconfig.json'
    },
    'prod': {
        'portal-url': 'https://www.arcgis.com',
        'wayback-imagery-base': 'https://wayback.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/MapServer',
        'wayback-config': 'https://s3-us-west-2.amazonaws.com/config.maptiles.arcgis.com/waybackconfig.json'
    }
}