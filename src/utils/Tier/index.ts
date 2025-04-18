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

import { TIER } from '@typings/index';

/**
 * Determines if the application is running in development mode.
 * Development mode is identified by specific hostnames or patterns.
 * If the hostname is 'livingatlasdev.arcgis.com' or matches the pattern '*.arcgis.com' with a port,
 * it is considered to be in development mode.
 */
const isDevMode =
    window.location.hostname === 'livingatlasdev.arcgis.com' ||
    /.*\.arcgis\.com:\d+/.test(window.location.host);
console.log(`Is development mode: ${isDevMode}`);

/**
 * The current tier of the application, either 'development' or 'production'.
 * In development mode, it is set to 'development',
 * otherwise it is set to 'production'.
 */
export const tier: TIER = isDevMode ? 'development' : 'production';
console.log(`Current tier: ${tier}`);

/**
 * Returns the ArcGIS Online portal URL based on the current tier.
 * If the tier is 'development', it returns the development portal URL.
 * Otherwise, it returns the production portal URL.
 */
export const getArcGISOnlinePortalUrl = () => {
    if (tier === 'development') {
        return 'https://devext.arcgis.com';
    }

    return 'https://www.arcgis.com';
};

// const getServiceUrl = (key?: ValidServiceUrlNames) => {
//     const serviceUrls =
//         isDevMode && config.developmentEnv.serviceUrls
//             ? config.developmentEnv.serviceUrls
//             : config.productionEnv.serviceUrls;
//     return serviceUrls[key] || '';
// };

// export { getServiceUrl };
