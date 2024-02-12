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

import WebTileLayer from '@arcgis/core/layers/WebTileLayer';
// import WMTSLayer from '@arcgis/core/layers/WMTSLayer'

import { IWaybackItem } from '@typings/index';
// import { getServiceUrl } from '@utils/Tier';
// export const WAYBACK_LAYER_ID = 'waybackWMTSLayer'
// const WaybackImagerBaseURL = getServiceUrl('wayback-imagery-base')

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
    //     id: WAYBACK_LAYER_ID,
    //     url: WaybackImagerBaseURL + '/WMTS/1.0.0/WMTSCapabilities.xml',
    //     activeLayer: {
    //         id: waybackItem.layerIdentifier
    //     }
    // });

    return waybackLayer;
};
