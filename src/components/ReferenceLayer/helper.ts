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
