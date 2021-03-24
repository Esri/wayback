
// import { loadModules } from 'esri-loader';
// import IWebTileLayer from 'esri/layers/WebTileLayer';

import WebTileLayer from '@arcgis/core/layers/WebTileLayer'

import { IWaybackItem } from "../../types";

export const getWaybackLayer = (waybackItem:IWaybackItem):WebTileLayer=>{

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

    return waybackLayer;
}