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

import React, { useRef, useEffect } from 'react';

import { IWaybackItem } from '@typings/index';

import MapView from '@arcgis/core/views/MapView';
import Swipe from '@arcgis/core/widgets/Swipe';
import WebTileLayer from '@arcgis/core/layers/WebTileLayer';
import { watch } from '@arcgis/core/core/reactiveUtils';

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
    const swipeWidgetRef = useRef<Swipe>(null);
    const layersRef = useRef<WebTileLayer[]>([]);

    const init = async () => {
        if (swipeWidgetRef.current) {
            show();
        } else {
            const leadingLayer = getWaybackLayer(waybackItem4LeadingLayer);
            const trailingLayer = getWaybackLayer(waybackItem4TrailingLayer);

            layersRef.current = [leadingLayer, trailingLayer];

            mapView.map.addMany(layersRef.current, 1);

            const swipe = new Swipe({
                view: mapView,
                leadingLayers: [leadingLayer],
                trailingLayers: [trailingLayer],
                direction: 'horizontal',
                position: 50, // position set to middle of the view (50%)
            });

            swipeWidgetRef.current = swipe;

            mapView.ui.add(swipe);

            addEventHandlers(swipe);

            // onLoaded();
        }
    };

    const addEventHandlers = (swipeWidget: Swipe) => {
        watch(
            () => swipeWidget.position,
            (position: number) => {
                positionOnChange(position);
            }
        );
    };

    const show = () => {
        mapView.ui.add(swipeWidgetRef.current);

        layersRef.current.forEach((layer) => {
            layer.visible = true;
        });
    };

    const hide = () => {
        if (swipeWidgetRef.current) {
            mapView.ui.remove(swipeWidgetRef.current);
        }

        layersRef.current.forEach((layer) => {
            layer.visible = false;
        });
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

        const newLayer = await getWaybackLayer(layerItem);
        layersRef.current[layerIndex] = newLayer;
        mapView.map.add(newLayer, 1);

        if (layerType === 'leading') {
            swipeWidgetRef.current.leadingLayers.removeAll();
            swipeWidgetRef.current.leadingLayers.add(newLayer);
        } else {
            swipeWidgetRef.current.trailingLayers.removeAll();
            swipeWidgetRef.current.trailingLayers.add(newLayer);
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
        isOpen && mapView ? init() : hide();
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
