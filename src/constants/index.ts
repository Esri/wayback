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
