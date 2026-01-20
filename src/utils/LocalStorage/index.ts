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

import { ReferenceLayerLanguage } from '@constants/map';
import { DownloadJob } from '@store/DownloadMode/reducer';
// import { MapCenter } from '@store/Map/reducer';

enum KEYS {
    // defaultExtent = 'WaybackAppDefaultExtent',
    defaultLocation = 'WaybackAppDefaultLocation',
    showUpdatesWithLocalChanges = 'WaybackAppShouldShowUpdatesWithLocalChanges',
    shouldOpenSaveWebMapDialog = 'WaybackAppShouldOpenSaveWebMapDialog',
    customPortalUrl = 'WaybackAppCustomPortalUrl',
    hashParams = 'WaybackAppHashParam',
    downloadJobs = 'WaybackAppDownloadJobs',
    referenceLayerLocale = 'WaybackAppPreferredReferenceLayerLocale',
}

const setItem = (key: KEYS, value = '') => {
    localStorage.setItem(key, value);
};

const getItem = (key: KEYS) => {
    return localStorage.getItem(key) || null;
};

const removeItem = (key: KEYS) => {
    localStorage.removeItem(key);
};

// const saveDefaultMapLocation = (center: MapCenter, zoom: number) => {
//     if (!center || zoom === undefined) {
//         console.error('default location is missing');
//         return;
//     }

//     if (center.lat === undefined || center.lon === undefined) {
//         console.error('default location is missing lat or lon');
//         return;
//     }

//     const location = [center.lon, center.lat, zoom].join(',');

//     setItem(KEYS.defaultLocation, JSON.stringify(location));
// };

// const getDefaultMapLocation = (): {
//     center: MapCenter;
//     zoom: number;
// } | null => {
//     const defaultLocation = getItem(KEYS.defaultLocation);

//     if (!defaultLocation) {
//         return null;
//     }

//     const locParts = JSON.parse(defaultLocation).split(',');

//     if (
//         locParts.length === 3 &&
//         !isNaN(parseFloat(locParts[0])) &&
//         !isNaN(parseFloat(locParts[1])) &&
//         !isNaN(parseInt(locParts[2], 10))
//     ) {
//         return {
//             center: {
//                 lon: parseFloat(locParts[0]),
//                 lat: parseFloat(locParts[1]),
//             },
//             zoom: parseInt(locParts[2], 10),
//         };
//     }
//     return null;
// };

// const setShouldOpenSaveWebMapDialog = () => {
//     setItem(KEYS.shouldOpenSaveWebMapDialog, 'true');
// };

// const getCustomPortalUrl = () => {
//     return getItem(KEYS.customPortalUrl);
// };

// const setCustomPortalUrl = (portalUrl = '') => {
//     portalUrl
//         ? setItem(KEYS.customPortalUrl, portalUrl)
//         : removeItem(KEYS.customPortalUrl);
// };

// const getShouldOpenSaveWebMapDialog = () => {
//     const val = getItem(KEYS.shouldOpenSaveWebMapDialog);

//     if (val) {
//         removeItem(KEYS.shouldOpenSaveWebMapDialog);
//     }

//     return val === 'true' ? true : false;
// };

const saveDownloadJobs2LocalStorage = (jobs: DownloadJob[]) => {
    if (!jobs || !jobs.length) {
        removeItem(KEYS.downloadJobs);
    } else {
        setItem(KEYS.downloadJobs, JSON.stringify(jobs));
    }
};

const getDownloadJobsFromLocalStorage = (): DownloadJob[] => {
    const val = getItem(KEYS.downloadJobs);
    return val ? JSON.parse(val) : [];
};

export const setPreferredReferenceLayerLocale = (
    locale: ReferenceLayerLanguage
) => {
    if (locale) {
        setItem(KEYS.referenceLayerLocale, locale);
    } else {
        removeItem(KEYS.referenceLayerLocale);
    }
};

export const getPreferredReferenceLayerLocale = (): ReferenceLayerLanguage => {
    const val = getItem(KEYS.referenceLayerLocale);
    return val as ReferenceLayerLanguage;
};

/**
 * Cleans up local storage by removing deprecated keys
 */
const cleanUpLocalStorage = () => {
    // removeItem(KEYS.defaultExtent);
    removeItem(KEYS.defaultLocation);
    removeItem(KEYS.customPortalUrl);
    removeItem(KEYS.shouldOpenSaveWebMapDialog);
    removeItem(KEYS.hashParams);
    removeItem(KEYS.showUpdatesWithLocalChanges);
};
cleanUpLocalStorage();

export {
    // saveDefaultMapLocation,
    // getDefaultMapLocation,
    // getCustomPortalUrl,
    // setCustomPortalUrl,
    // setShouldOpenSaveWebMapDialog,
    // getShouldOpenSaveWebMapDialog,
    saveDownloadJobs2LocalStorage,
    getDownloadJobsFromLocalStorage,
};
