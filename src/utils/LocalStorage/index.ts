import { IExtentGeomety } from "../../types";

const KEYS = {
    defaultExtent: 'WaybackAppDefaultExtent',
    showUpdatesWithLocalChanges: 'WaybackAppShouldShowUpdatesWithLocalChanges'
}

const saveDefaultExtent = (extent:IExtentGeomety)=>{
    if(!extent){
        console.error('default extent is missing');
        return;
    }
    setItem(KEYS.defaultExtent, JSON.stringify(extent));
};

const getDefaultExtent = ():IExtentGeomety=>{
    const defaultExtent = getItem(KEYS.defaultExtent)
    return defaultExtent ? JSON.parse(defaultExtent) : null;
};

const setShouldShowUpdatesWithLocalChanges = (val=false)=>{
    setItem(KEYS.showUpdatesWithLocalChanges, JSON.stringify(val));
};

const getShouldShowUpdatesWithLocalChanges = ()=>{
    return getItem(KEYS.showUpdatesWithLocalChanges) === 'true';
};

const setItem = (key?:string, value='')=>{
    if(key){
        localStorage.setItem(key, value);
    }
};

const getItem = (key?:string)=>{
    return key ? localStorage.getItem(key) : null;
};

export {
    saveDefaultExtent,
    getDefaultExtent,
    setShouldShowUpdatesWithLocalChanges,
    getShouldShowUpdatesWithLocalChanges
};