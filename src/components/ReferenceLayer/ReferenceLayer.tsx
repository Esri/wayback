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
// import IVectorTileLayer from 'esri/layers/VectorTileLayer';

import MapView from '@arcgis/core/views/MapView';
import VectorTileLayer from '@arcgis/core/layers/VectorTileLayer';

type Props = {
    url?: string;
    isVisible: boolean;
    mapView?: MapView;
};

export const REFERENCE_LAYER_TITLE = 'Reference Layer';

const ReferenceLayer: React.FC<Props> = ({ url, isVisible, mapView }) => {
    const referenceLayerRef = useRef<VectorTileLayer>(null);

    const init = () => {
        // try {

        //     type Modules = [
        //         typeof IVectorTileLayer
        //     ];

        //     const [VectorTileLayer] = await (loadModules([
        //         'esri/layers/VectorTileLayer',
        //     ]) as Promise<Modules>);

        //     referenceLayerRef.current = new VectorTileLayer({
        //         portalItem: {
        //             id: REFERENCE_LAYER_ITEM_ID,
        //         },
        //         visible: isVisible
        //     });

        //     mapView.map.add(referenceLayerRef.current)

        // } catch (err) {
        //     console.error(err);
        // }

        referenceLayerRef.current = new VectorTileLayer({
            url,
            visible: isVisible,
            title: REFERENCE_LAYER_TITLE,
        });

        mapView.map.add(referenceLayerRef.current);
    };

    useEffect(() => {
        // console.log(mapView)
        if (mapView) {
            init();
        }
    }, [mapView]);

    useEffect(() => {
        if (mapView && referenceLayerRef.current) {
            referenceLayerRef.current.visible = isVisible;
        }
    }, [isVisible]);

    useEffect(() => {
        if (!mapView || !referenceLayerRef.current) {
            return;
        }

        mapView.map.remove(referenceLayerRef.current);

        init();
    }, [url]);

    return null;
};

export default ReferenceLayer;
