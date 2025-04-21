import { tier } from '@utils/Tier';

/**
 * Maxar's Vivid Advanced basemap product provides committed image currency in a high-resolution,
 * high-quality image layer over defined metropolitan and high-interest areas across the globe.
 */
export const VIVID_ADVANCED_FROM_MAXAR_URL_PROD =
    'https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/Vivid_Advanced_Blocks_Publication_View/FeatureServer/0';

export const VIVID_ADVANCED_FROM_MAXAR_URL_DEV = `https://servicesdev.arcgis.com/VLx4vrvwONglS8iz/arcgis/rest/services/Vivid_Advanced_Blocks_Publication_View/FeatureServer/0`;

export const VIVID_ADVANCED_FROM_MAXAR_URL =
    tier === 'production'
        ? VIVID_ADVANCED_FROM_MAXAR_URL_PROD
        : VIVID_ADVANCED_FROM_MAXAR_URL_DEV;

/**
 * Maxar's Vivid Standard basemap product provides a visually consistent and continuous image layer
 * over large areas through advanced image mosaicking techniques, including tonal balancing and
 * seamline blending across thousands of image strips.
 */
export const VIVID_STANDARD_FROM_MAXAR_URL_PROD =
    'https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/Vivid_Standard_Blocks_Publication_View/FeatureServer/0';

export const VIVID_STANDARD_FROM_MAXAR_URL_DEV = `https://servicesdev.arcgis.com/VLx4vrvwONglS8iz/arcgis/rest/services/Vivid_Standard_Blocks_Publication_View/FeatureServer/0`;

export const VIVID_STANDARD_FROM_MAXAR_URL =
    tier === 'production'
        ? VIVID_STANDARD_FROM_MAXAR_URL_PROD
        : VIVID_STANDARD_FROM_MAXAR_URL_DEV;

/**
 * The GIS User Community, including mapping agencies around the world, enhance the ArcGIS World Imagery map by contributing recent,
 * submeter-resolution aerial imagery through the Community Maps Program.
 */
export const COMMUNITY_COMTRIBUTED_IMAGERY_UPDATES_URL_PROD =
    'https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/Community_Blocks_Simple_Publication_View/FeatureServer/0';

export const COMMUNITY_COMTRIBUTED_IMAGERY_UPDATES_URL_DEV = `https://servicesdev.arcgis.com/VLx4vrvwONglS8iz/arcgis/rest/services/Community_Blocks_Simple_Publication_View/FeatureServer/0`;

export const COMMUNITY_COMTRIBUTED_IMAGERY_UPDATES_URL =
    tier === 'production'
        ? COMMUNITY_COMTRIBUTED_IMAGERY_UPDATES_URL_PROD
        : COMMUNITY_COMTRIBUTED_IMAGERY_UPDATES_URL_DEV;

/**
 * Fields available in the Imagery Updates layers:
 * - Vivid Advanced
 * - Vivid Standard
 * - Community Contributed Imagery Updates
 *
 * @example
 * ```json
 * [
 *   // example of feature from Vivid Advanced layer
 *   {
 *     "attributes": {
 *       "OBJECTID": 637,
 *       "AreaName": "Oklahoma_City",
 *       "CountryName": "United_States_of_America",
 *       "AreaSQKM": 2162,
 *       "GSD": null,
 *       "PubState": "Published",
 *       "PubDate": 1482256800000
 *     }
 *   },
 *   // example of feature from Vivid Standard layer
 *   {
 *     "attributes": {
 *       "OBJECTID": 36,
 *       "AreaName": "SA11",
 *       "CountryName": "Paraguay, Brazil, Uruguay",
 *       "AreaSQKM": 1629115,
 *       "GSD": 1,
 *       "PubState": "Published",
 *       "PubDate": 1476295200000
 *     }
 *   },
 *   // example of feature from Community Contributed Imagery Updates layer
 *   {
 *     "attributes": {
 *       "OBJECTID": 21,
 *       "AreaName": "Albany County",
 *       "CountryName": "United States",
 *       "AreaSQKM": 972.2787,
 *       "GSD": 0.15,
 *       "PubState": "Published",
 *       "PubDate": 1649268000000
 *     }
 *   },
 *   {
 *     "attributes": {
 *       "OBJECTID": 1628,
 *       "AreaName": "Sunshine Coast Regional District",
 *       "CountryName": "Canada",
 *       "AreaSQKM": 256.7752,
 *       "GSD": 0.07,
 *       "PubState": "Pending",
 *       "PubDate": 1747936800000
 *     }
 *   }
 * ]
 * ```
 */
export const IMAGERY_UPDATES_LAYER_FIELDS = {
    OBJECTID: 'OBJECTID',
    AREA_NAME: 'AreaName',
    COUNTRY_NAME: 'CountryName',
    AREA_SQKM: 'AreaSQKM',
    /**
     * Ground Sample Distance (GSD) is the distance between pixel centers measured on the ground
     */
    GSD: 'GSD',
    PUB_STATE: 'PubState',
    PUB_DATE: 'PubDate',
};

/**
 * Imagery Updates Statuses
 *
 * - `pending`: Imagery updates that are not yet published.
 * - `published`: Imagery updates that have been published.
 */
export type ImageryUpdatesStatus = 'pending' | 'published';

/**
 * Imagery Updates Categories
 *
 * - `vivid-advanced`: Imagery updates from Maxar's Vivid Advanced basemap product.
 * - `vivid-standard`: Imagery updates from Maxar's Vivid Standard basemap product.
 * - `community-contributed`: Imagery updates contributed by the GIS User Community.
 */
export type ImageryUpdatesCategory =
    | 'vivid-advanced'
    | 'vivid-standard'
    | 'community-contributed';
