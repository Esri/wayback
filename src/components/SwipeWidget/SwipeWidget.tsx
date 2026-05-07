/* Copyright 2024-2026 Esri
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

import React, { useRef, useEffect } from 'react';

import { IWaybackItem } from '@typings/index';

import MapView from '@arcgis/core/views/MapView';
import WebTileLayer from '@arcgis/core/layers/WebTileLayer';
import { ArcgisSwipe } from '@arcgis/map-components/components/arcgis-swipe';
import '@arcgis/map-components/components/arcgis-swipe';
import { ArcgisMap } from '@arcgis/map-components/components/arcgis-map';

import { getWaybackLayer } from '../WaybackLayer/getWaybackLayer';

type Props = {
    waybackItem4LeadingLayer: IWaybackItem;
    waybackItem4TrailingLayer: IWaybackItem;
    isOpen: boolean;
    mapView?: MapView;

    positionOnChange: (position: number) => void;
    // onLoaded:()=>void;
};

type SwipeWidgetLayer = 'leading' | 'trailing';

const SwipeWidget: React.FC<Props> = ({
    waybackItem4LeadingLayer,
    waybackItem4TrailingLayer,
    isOpen,
    mapView,
    positionOnChange,
    // onLoaded
}) => {
    const swipeWidgetRef = useRef<ArcgisSwipe | null>(null);
    const layersRef = useRef<WebTileLayer[]>([]);

    const init = async () => {
        const leadingLayer = getWaybackLayer(waybackItem4LeadingLayer);
        const trailingLayer = getWaybackLayer(waybackItem4TrailingLayer);

        layersRef.current = [leadingLayer, trailingLayer];

        mapView.map.addMany(layersRef.current, 1);

        const mapViewComponent = document.querySelector(
            'arcgis-map'
        ) as ArcgisMap;

        if (!mapViewComponent) {
            console.error('MapView component not found in the DOM');
            return;
        }

        const swipeComponent = document.createElement(
            'arcgis-swipe'
        ) as ArcgisSwipe;
        swipeComponent.position = 50;
        swipeComponent.view = mapView;
        swipeComponent.startLayers.add(leadingLayer);
        swipeComponent.endLayers.add(trailingLayer);

        mapViewComponent.appendChild(swipeComponent);

        swipeComponent.addEventListener('arcgisSwipeInput', () => {
            positionOnChange(swipeWidgetRef.current.position);
        });

        swipeWidgetRef.current = swipeComponent;
    };

    const destroy = () => {
        if (swipeWidgetRef.current) {
            swipeWidgetRef.current.destroy();
            swipeWidgetRef.current = null;
        }

        if (mapView && layersRef.current.length > 0) {
            mapView.map.removeMany(layersRef.current);
        }
    };

    const setLayer = async (
        layerItem: IWaybackItem,
        layerType: SwipeWidgetLayer
    ) => {
        if (!mapView) {
            return;
        }

        const layerIndex = layerType === 'leading' ? 0 : 1;

        const existingLayer = layersRef.current[layerIndex];

        if (existingLayer) {
            mapView.map.remove(existingLayer);
        }

        const newLayer = getWaybackLayer(layerItem);
        layersRef.current[layerIndex] = newLayer;
        mapView.map.add(newLayer, 1);

        if (layerType === 'leading') {
            swipeWidgetRef.current.startLayers.removeAll();
            swipeWidgetRef.current.startLayers.add(newLayer);
        } else {
            swipeWidgetRef.current.endLayers.removeAll();
            swipeWidgetRef.current.endLayers.add(newLayer);
        }
    };

    // const getWaybackLayer=async(data:IWaybackItem)=>{

    //     if(!data){
    //         return null;
    //     }

    //     try {
    //         type Modules = [typeof IWebTileLayer];

    //         const [WebTileLayer] = await (loadModules([
    //             'esri/layers/WebTileLayer',
    //         ]) as Promise<Modules>);

    //         const waybackLayer = new WebTileLayer({
    //             urlTemplate: data.itemURL,
    //         });

    //         return waybackLayer;

    //     } catch (err) {
    //         return null;
    //     }
    // }

    useEffect(() => {
        if (isOpen && mapView) {
            init();
        } else {
            destroy();
        }
    }, [isOpen, mapView]);

    useEffect(() => {
        if (waybackItem4LeadingLayer && swipeWidgetRef.current) {
            setLayer(waybackItem4LeadingLayer, 'leading');
        }
    }, [waybackItem4LeadingLayer]);

    useEffect(() => {
        if (waybackItem4TrailingLayer && swipeWidgetRef.current) {
            setLayer(waybackItem4TrailingLayer, 'trailing');
        }
    }, [waybackItem4TrailingLayer]);

    return null;
};

export default SwipeWidget;
