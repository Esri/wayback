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

import React, { useEffect, useRef } from 'react';

// import { loadModules } from 'esri-loader';

// import IMapView from 'esri/views/MapView';
// import IWebTileLayer from 'esri/layers/WebTileLayer';
import MapView from '@arcgis/core/views/MapView';
import WebTileLayer from '@arcgis/core/layers/WebTileLayer';
import { IWaybackItem } from '@typings/index';

import { getWaybackLayer } from './getWaybackLayer';

type Props = {
    isVisible: boolean;
    activeWaybackItem: IWaybackItem;
    mapView?: MapView;
};

const WaybackLayer: React.FC<Props> = ({
    isVisible,
    activeWaybackItem,
    mapView,
}) => {
    const waybackLayerRef = useRef<WebTileLayer>(null);

    const updateWaybackLayer = () => {
        if (waybackLayerRef.current) {
            mapView.map.remove(waybackLayerRef.current);
        }

        waybackLayerRef.current = getWaybackLayer(activeWaybackItem);

        // always add as the bottom most layer
        mapView.map.add(waybackLayerRef.current, 0);
    };

    // const getWaybackLayer = async()=>{

    //     try {
    //         type Modules = [typeof IWebTileLayer];

    //         const [WebTileLayer] = await (loadModules([
    //             'esri/layers/WebTileLayer',
    //         ]) as Promise<Modules>);

    //         const waybackLayer = new WebTileLayer({
    //             urlTemplate: activeWaybackItem.itemURL,
    //         });

    //         return waybackLayer;

    //     } catch (err) {
    //         console.error(err)
    //         return null;
    //     }
    // }

    useEffect(() => {
        if (mapView && activeWaybackItem) {
            updateWaybackLayer();
        }
    }, [mapView, activeWaybackItem]);

    useEffect(() => {
        if (!waybackLayerRef.current) {
            return;
        }

        waybackLayerRef.current.visible = isVisible;
    }, [isVisible]);

    return null;
};

export default WaybackLayer;
