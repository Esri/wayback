/* Copyright 2025 Esri
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

/**
 * ArcGIS Portal root URL.
 * Defaults to https://www.arcgis.com if not specified in the environment variables.
 */
export const ARCGIS_PROTAL_ROOT =
    ENV_ARCGIS_PORTAL_ROOT_URL || 'https://www.arcgis.com';

/**
 * Base URL for the Wayport GP Service.
 *
 * Can be overridden by setting WAYBACK_EXPORT_GP_SERVICE_ROOT_URL in environment variables.
 * Defaults to 'https://wayport.maptiles.arcgis.com/arcgis/rest/services/Wayport/GPServer/Wayport' if not specified.
 */
export const WAYBACK_EXPORT_GP_SERVICE_ROOT_URL =
    ENV_WAYBACK_EXPORT_GP_SERVICE_ROOT_URL ||
    'https://wayport.maptiles.arcgis.com/arcgis/rest/services/Wayport/GPServer/Wayport';

/**
 * Feature layer URL for the Vivid Advanced Block Publication View.
 *
 * Provides imagery content tracking updates for all Vivid Advanced Blocks from Vantor that have been
 * published to the World Imagery Basemap in the last year or are pending publication.
 *
 * Can be overridden by setting METROPOLITAN_UPDATES_FEATURE_LAYER_URL in environment variables.
 * Defaults to 'https://services.arcgis.com/jIL9msH9OI208GCb/arcgis/rest/services/Vivid_Advanced_Blocks_Publication_View/FeatureServer/0' if not specified.
 *
 * @see https://www.arcgis.com/home/item.html?id=1491ff7659824fe099aafdcbb633ce90
 */
export const METROPOLITAN_UPDATES_FEATURE_LAYER_URL =
    ENV_METROPOLITAN_UPDATES_FEATURE_LAYER_URL ||
    'https://services.arcgis.com/jIL9msH9OI208GCb/arcgis/rest/services/Vivid_Advanced_Blocks_Publication_View/FeatureServer/0';

/**
 * Feature layer URL for the Vivid Standard Block Publication View.
 *
 * Provides imagery content tracking updates for all Vivid Standard Blocks from Vantor that have been
 * published to the World Imagery Basemap in the last year or are pending publication.
 *
 * Can be overridden by setting REGIONAL_UPDATES_FEATURE_LAYER_URL in environment variables.
 * Defaults to 'https://services.arcgis.com/jIL9msH9OI208GCb/arcgis/rest/services/Vivid_Standard_Blocks_Publication_View/FeatureServer/0' if not specified.
 *
 * @see https://www.arcgis.com/home/item.html?id=ac2c8e911c3a447d8ac3ba1a8514adf1
 */
export const REGIONAL_UPDATES_FEATURE_LAYER_URL =
    ENV_REGIONAL_UPDATES_FEATURE_LAYER_URL ||
    'https://services.arcgis.com/jIL9msH9OI208GCb/ArcGIS/rest/services/Vivid_Standard_Blocks_Publication_View/FeatureServer/0';

/**
 * Feature layer URL for the Community Blocks Publication View.
 *
 * Provides imagery content tracking updates for all aerial imagery contributions made through
 * the Esri Community Maps Program that have been published to the World Imagery Basemap in the
 * last year or are pending publication.
 *
 * Can be overridden by setting COMMUNITY_UPDATES_FEATURE_LAYER_URL in environment variables.
 * Defaults to 'https://services.arcgis.com/jIL9msH9OI208GCb/ArcGIS/rest/services/Community_Blocks_Publication_View/FeatureServer/0' if not specified.
 *
 * @see https://www.arcgis.com/home/item.html?id=db783b28d17c409bb0f0537c40ac09bd
 */
export const COMMUNITY_UPDATES_FEATURE_LAYER_URL =
    ENV_COMMUNITY_UPDATES_FEATURE_LAYER_URL ||
    'https://services.arcgis.com/jIL9msH9OI208GCb/ArcGIS/rest/services/Community_Blocks_Publication_View/FeatureServer/0';

/**
 * Root URL of the World Imagery Basemap service.
 *
 * Used as the basemap for webmaps created by the application.
 *
 * Can be overridden by setting WORLD_IMAGERY_BASEMAP_URL in environment variables.
 * Defaults to 'https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/' if not specified.
 */
export const WORLD_IMAGERY_BASEMAP_URL =
    ENV_WORLD_IMAGERY_BASEMAP_URL ||
    'https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/';
