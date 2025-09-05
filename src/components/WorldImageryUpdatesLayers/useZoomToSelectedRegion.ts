import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import MapView from '@arcgis/core/views/MapView';
import { useAppDispatch, useAppSelector } from '@store/configureStore';
import { shouldZoomToSelectedRegionChanged } from '@store/UpdatesMode/reducer';
import { selectShouldZoomToSelectedRegion } from '@store/UpdatesMode/selectors';
import React, { useEffect } from 'react';

export const useZoomToSelectedRegion = (
    worldImageryUpdatesLayerRef: React.RefObject<FeatureLayer>,
    region: string,
    whereClause: string,
    mapView?: MapView
): void => {
    const dispatch = useAppDispatch();

    const shouldZoomToSelectedRegion = useAppSelector(
        selectShouldZoomToSelectedRegion
    );

    useEffect(() => {
        if (
            !worldImageryUpdatesLayerRef.current ||
            !mapView ||
            !shouldZoomToSelectedRegion
        ) {
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

        // reset the flag to prevent zooming on subsequent region changes
        dispatch(shouldZoomToSelectedRegionChanged(false));
    }, [
        worldImageryUpdatesLayerRef.current,
        region,
        shouldZoomToSelectedRegion,
    ]);

    return null;
};
