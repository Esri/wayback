import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import MapView from '@arcgis/core/views/MapView';
import React, { useEffect } from 'react';

export const useZoomToSelectedRegion = (
    worldImageryUpdatesLayerRef: React.RefObject<FeatureLayer>,
    region: string,
    whereClause: string,
    mapView?: MapView
): void => {
    useEffect(() => {
        if (!worldImageryUpdatesLayerRef.current || !mapView) {
            return;
        }

        // if (!region) {
        //     return;
        // }

        worldImageryUpdatesLayerRef.current
            .queryExtent({
                where: whereClause,
                returnGeometry: true,
            })
            .then((result) => {
                console.log('result:', result);
                mapView.goTo({
                    target: result.extent,
                });
            })
            .catch((error) => {
                console.error('Error querying features:', error);
            });
    }, [worldImageryUpdatesLayerRef.current, region]);

    return null;
};
