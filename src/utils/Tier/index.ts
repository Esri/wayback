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

import { TIER, ValidServiceUrlNames } from '@typings/index';
import config from '../../app-config';

const isHostedOnArcGisDomain = (() => {
    return window.location.hostname.match(/arcgis.com/gi) ? true : false;
})();

export const isHostedOnLivingAtlasDomain = (() => {
    return window.location.hostname.match(/livingatlas/gi) ? true : false;
})();

// the wayback app is hosted on bothe Living Atlas dev and production server so the Living Atlas team can test the dev services using the dev app before we release them to production
// however, if the app is hosted on somewhere else, then just return false so the app will always use the production services
export const isDevMode = (() => {
    if (!config.developmentEnv) {
        return false;
    }

    if (!isHostedOnArcGisDomain && !isHostedOnLivingAtlasDomain) {
        return false;
    }

    const isDev =
        window.location.hostname !== 'livingatlas.arcgis.com' ? true : false;

    return isDev;
})();

/**
 * The current tier of the application, either 'development' or 'production'.
 */
export const tier: TIER = isDevMode ? 'development' : 'production';

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

const getServiceUrl = (key?: ValidServiceUrlNames) => {
    const serviceUrls =
        isDevMode && config.developmentEnv.serviceUrls
            ? config.developmentEnv.serviceUrls
            : config.productionEnv.serviceUrls;
    return serviceUrls[key] || '';
};

export { getServiceUrl };
