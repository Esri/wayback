// import WebTileLayer from '@arcgis/core/layers/WebTileLayer';
import WMTSLayer from '@arcgis/core/layers/WMTSLayer'

import { IWaybackItem } from '../../types';
import { getServiceUrl } from '../../utils/Tier';

export const WAYBACK_LAYER_ID = 'waybackWMTSLayer'

const WaybackImagerBaseURL = getServiceUrl('wayback-imagery-base')

export const getWaybackLayer = (waybackItem: IWaybackItem): WMTSLayer => {
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

    // const waybackLayer = new WebTileLayer({
    //     urlTemplate: waybackItem.itemURL,
    // });

    const waybackLayer = new WMTSLayer({
        id: WAYBACK_LAYER_ID,
        url: WaybackImagerBaseURL + '/WMTS/1.0.0/WMTSCapabilities.xml',
        activeLayer: {
            id: waybackItem.layerIdentifier
        }
    });

    return waybackLayer;
};
