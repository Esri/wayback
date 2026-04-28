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

import VectorTileLayer from '@arcgis/core/layers/VectorTileLayer';
import { REFERENCE_LAYER_TITLE } from './ReferenceLayer';
import MapView from '@arcgis/core/views/MapView';

/**
 * Gets the reference layer from the map if it exists.
 * @param mapView - instance of MapView
 * @returns the reference layer if it exists in the map, otherwise null.
 */
export const getReferenceLayer = (mapView: MapView): VectorTileLayer | null => {
    if (!mapView) {
        return null;
    }
    const layers = mapView.map.layers;

    const referenceLayer = layers.find(
        (layer) => layer.title === REFERENCE_LAYER_TITLE
    );

    if (referenceLayer && referenceLayer.type === 'vector-tile') {
        return referenceLayer as VectorTileLayer;
    }

    return null;
};
