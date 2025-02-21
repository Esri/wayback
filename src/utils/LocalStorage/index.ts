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
import { IExtentGeomety } from '@typings/index';

enum KEYS {
    defaultExtent = 'WaybackAppDefaultExtent',
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

const saveDefaultExtent = (extent: IExtentGeomety) => {
    if (!extent) {
        console.error('default extent is missing');
        return;
    }
    setItem(KEYS.defaultExtent, JSON.stringify(extent));
};

const getDefaultExtent = (): IExtentGeomety => {
    const defaultExtent = getItem(KEYS.defaultExtent);
    return defaultExtent ? JSON.parse(defaultExtent) : null;
};

// const setShouldShowUpdatesWithLocalChanges = (val = false) => {
//     setItem(KEYS.showUpdatesWithLocalChanges, JSON.stringify(val));
// };

// const getShouldShowUpdatesWithLocalChanges = () => {
//     return getItem(KEYS.showUpdatesWithLocalChanges) === 'true';
// };

const setShouldOpenSaveWebMapDialog = () => {
    setItem(KEYS.shouldOpenSaveWebMapDialog, 'true');
};

const getCustomPortalUrl = () => {
    return getItem(KEYS.customPortalUrl);
};

const setCustomPortalUrl = (portalUrl = '') => {
    portalUrl
        ? setItem(KEYS.customPortalUrl, portalUrl)
        : removeItem(KEYS.customPortalUrl);
};

const getShouldOpenSaveWebMapDialog = () => {
    const val = getItem(KEYS.shouldOpenSaveWebMapDialog);

    if (val) {
        removeItem(KEYS.shouldOpenSaveWebMapDialog);
    }

    return val === 'true' ? true : false;
};

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

export {
    saveDefaultExtent,
    getDefaultExtent,
    getCustomPortalUrl,
    setCustomPortalUrl,
    // setShouldShowUpdatesWithLocalChanges,
    // getShouldShowUpdatesWithLocalChanges,
    setShouldOpenSaveWebMapDialog,
    getShouldOpenSaveWebMapDialog,
    saveDownloadJobs2LocalStorage,
    getDownloadJobsFromLocalStorage,
    // saveHashParams,
    // getHashParamsFromLocalStorage,
};
