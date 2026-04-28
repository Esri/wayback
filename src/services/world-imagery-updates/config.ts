/* Copyright 2024-2026 Esri
 *
 * Licensed under the Apache License Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// import { tier } from '@utils/Tier';

import {
    COMMUNITY_UPDATES_FEATURE_LAYER_URL,
    METROPOLITAN_UPDATES_FEATURE_LAYER_URL,
    REGIONAL_UPDATES_FEATURE_LAYER_URL,
} from '@constants/index';

export const VIVID_ADVANCED_FROM_MAXAR_URL =
    METROPOLITAN_UPDATES_FEATURE_LAYER_URL;

export const VIVID_STANDARD_FROM_MAXAR_URL = REGIONAL_UPDATES_FEATURE_LAYER_URL;

export const COMMUNITY_COMTRIBUTED_IMAGERY_UPDATES_URL =
    COMMUNITY_UPDATES_FEATURE_LAYER_URL;

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
export const WORLD_IMAGERY_UPDATES_LAYER_FIELDS = {
    OBJECTID: 'OBJECTID',
    AREA_NAME: 'AreaName',
    // COUNTRY_NAME: 'CountryName',
    AREA_SQKM: 'AreaSQKM',
    /**
     * Ground Sample Distance (GSD) is the distance between pixel centers measured on the ground
     */
    GSD: 'GSD',
    PUB_STATE: 'PubState',
    PUB_DATE: 'PubDate',
    /**
     * Tag field contains the ISO Country Code for the update area, e.g. 'US' for United States, 'FR' for France, etc.
     */
    COUNTRY_CODE: 'Tag',
};

/**
 * Imagery Updates Statuses
 *
 * - `pending`: Imagery updates that are not yet published.
 * - `published`: Imagery updates that have been published.
 */
// export type WorldImageryUpdatesStatus = 'pending' | 'published';

export enum WorldImageryUpdatesStatusEnum {
    pending = 'Pending',
    published = 'Published',
}

/**
 * Imagery Updates Categories
 *
 * - `vivid-advanced`: Imagery updates from Vantor's Vivid Advanced basemap product.
 * - `vivid-standard`: Imagery updates from Vantor's Vivid Standard basemap product.
 * - `community-contributed`: Imagery updates contributed by the GIS User Community.
 */
export type ImageryUpdatesCategory =
    | 'vivid-advanced'
    | 'vivid-standard'
    | 'community-contributed';
