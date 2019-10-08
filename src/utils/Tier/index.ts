const isDevMode = ()=>{
    const isDev = window.location.hostname !== 'livingatlas.arcgis.com' ? true : false;

    return isDev;
};

export {
    isDevMode
};