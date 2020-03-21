import { IExtentGeometry } from '../../types';

const KEYS = {
    defaultExtent: 'WaybackAppDefaultExtent',
    showUpdatesWithLocalChanges: 'WaybackAppShouldShowUpdatesWithLocalChanges',
    shouldOpenSaveWebMapDialog: 'WaybackAppShouldOpenSaveWebMapDialog',
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

const saveDefaultExtent = (extent: IExtentGeometry) => {
    if (!extent) {
        console.error('default extent is missing');
        return;
    }
    setItem(KEYS.defaultExtent, JSON.stringify(extent));
};

const getDefaultExtent = (): IExtentGeometry => {
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

const getShouldOpenSaveWebMapDialog = () => {
    const val = getItem(KEYS.shouldOpenSaveWebMapDialog);

    if (val) {
        removeItem(KEYS.shouldOpenSaveWebMapDialog);
    }

    return val === 'true' ? true : false;
};

export {
    saveDefaultExtent,
    getDefaultExtent,
    setShouldShowUpdatesWithLocalChanges,
    getShouldShowUpdatesWithLocalChanges,
    setShouldOpenSaveWebMapDialog,
    getShouldOpenSaveWebMapDialog,
};
