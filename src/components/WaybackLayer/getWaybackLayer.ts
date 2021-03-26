// import { loadModules } from 'esri-loader';
// import IWebTileLayer from 'esri/layers/WebTileLayer';

import WebTileLayer from '@arcgis/core/layers/WebTileLayer';
// import WMTSLayer from '@arcgis/core/layers/WMTSLayer'

import { IWaybackItem } from '../../types';

export const getWaybackLayer = (waybackItem: IWaybackItem): WebTileLayer => {
    // try {
    //     type Modules = [typeof IWebTileLayer];

    //     const [WebTileLayer] = await (loadModules([
    //         'esri/layers/WebTileLayer',
    //     ]) as Promise<Modules>);

    //     const waybackLayer = new WebTileLayer({
    //         urlTemplate: waybackItem.itemURL,
    //     });

    //     return waybackLayer;

    // } catch (err) {
    //     console.error(err)
    //     return null;
    // }

    const waybackLayer = new WebTileLayer({
        urlTemplate: waybackItem.itemURL,
    });

    // const waybackLayer = new WMTSLayer({
    //     // id: this.WaybackLayerId,
    //     url: 'https://wayback.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/MapServer/WMTS/1.0.0/WMTSCapabilities.xml',
    //     activeLayer: {
    //       id: waybackItem.itemReleaseName,
    //     }
    // });

    return waybackLayer;
};
