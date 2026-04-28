/* Copyright 2024 Esri
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
 * The App ID used for authentication in the application.
 * This ID is defined in the environment variables.
 */
declare const APP_ID: string;

/**
 * Optional: Portal root URL for ArcGIS Online/Enterprise.
 */
declare const ENV_ARCGIS_PORTAL_ROOT_URL: string;

/**
 * Optional: Custom URL for fetching the Wayback configuration file.
 */
declare const ENV_WAYBACK_CONFIG_FILE_URL: string;

/**
 * Optional: Comma-separated list of subdomains for the Wayback tile service.
 */
declare const ENV_WAYBACK_SUBDOMAINS: string[];

/**
 * Optional: Wayback Export GP Service Root URL.
 */
declare const ENV_WAYBACK_EXPORT_GP_SERVICE_ROOT_URL: string;

/**
 * Optional: URL of feature layer providing updates for metropolitan areas.
 */
declare const ENV_METROPOLITAN_UPDATES_FEATURE_LAYER_URL: string;

/**
 * Optional: URL of feature layer providing updates for regional areas.
 */
declare const ENV_REGIONAL_UPDATES_FEATURE_LAYER_URL: string;

/**
 * Optional: URL of feature layer providing community contributed updates.
 */
declare const ENV_COMMUNITY_UPDATES_FEATURE_LAYER_URL: string;

/**
 * Optional: Base URL for the World Imagery basemap service.
 */
declare const ENV_WORLD_IMAGERY_BASEMAP_URL: string;

/**
 * Optional: Comma-separated list of supported languages in the application.
 */
declare const ENV_SUPPORTED_LANGUAGES: string[];
