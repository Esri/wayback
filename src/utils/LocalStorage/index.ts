import { IExtentGeomety } from '../../types';

const KEYS = {
    defaultExtent: 'WaybackAppDefaultExtent',
    showUpdatesWithLocalChanges: 'WaybackAppShouldShowUpdatesWithLocalChanges',
    shouldOpenSaveWebMapDialog: 'WaybackAppShouldOpenSaveWebMapDialog',
    customPortalUrl: 'WaybackAppCustomPortalUrl',
    hashParams: 'WaybackAppHashParam',
};

const setItem = (key?: string, value = '') => {
    if (key) {
        localStorage.setItem(key, value);
    }
};

const getItem = (key?: string) => {
    return key ? localStorage.getItem(key) : null;
};

const removeItem = (key?: string) => {
    if (key) {
        localStorage.removeItem(key);
    }
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

const setShouldShowUpdatesWithLocalChanges = (val = false) => {
    setItem(KEYS.showUpdatesWithLocalChanges, JSON.stringify(val));
};

const getShouldShowUpdatesWithLocalChanges = () => {
    return getItem(KEYS.showUpdatesWithLocalChanges) === 'true';
};

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

// const saveHashParams = () => {
//     const hash = location.hash.toString();

//     if (!hash) {
//         return;
//     }

//     setItem(KEYS.hashParams, hash.slice(1));
// };

// const getHashParamsFromLocalStorage = () => {
//     const val = getItem(KEYS.hashParams);

//     if (val) {
//         removeItem(KEYS.hashParams);
//     }

//     return val;
// };

export {
    saveDefaultExtent,
    getDefaultExtent,
    getCustomPortalUrl,
    setCustomPortalUrl,
    setShouldShowUpdatesWithLocalChanges,
    getShouldShowUpdatesWithLocalChanges,
    setShouldOpenSaveWebMapDialog,
    getShouldOpenSaveWebMapDialog,
    // saveHashParams,
    // getHashParamsFromLocalStorage,
};
