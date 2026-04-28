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

import { Extent } from '@arcgis/core/geometry';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import MapView from '@arcgis/core/views/MapView';
import { ImageryUpdatesCategory } from '@services/world-imagery-updates/config';
import { queryExtent } from '@services/world-imagery-updates/queryExtent';
import { useAppDispatch, useAppSelector } from '@store/configureStore';
import {
    isLoadingExtentForSelectedRegionChanged,
    shouldZoomToSelectedRegionChanged,
} from '@store/UpdatesMode/reducer';
import { selectShouldZoomToSelectedRegion } from '@store/UpdatesMode/selectors';
import { logger } from '@utils/IndexedDBLogger';
import React, { useEffect } from 'react';

export const useZoomToSelectedRegion = (
    // worldImageryUpdatesLayerRef: React.RefObject<FeatureLayer>,
    category: ImageryUpdatesCategory,
    region: string,
    whereClause: string,
    mapView?: MapView
): void => {
    const dispatch = useAppDispatch();

    const shouldZoomToSelectedRegion = useAppSelector(
        selectShouldZoomToSelectedRegion
    );

    useEffect(() => {
        (async () => {
            if (
                // !worldImageryUpdatesLayerRef.current ||
                !mapView ||
                !shouldZoomToSelectedRegion
            ) {
                return;
            }

            // if (!region) {
            //     return;
            // }

            dispatch(isLoadingExtentForSelectedRegionChanged(true));

            try {
                const extent = await queryExtent(category, whereClause);

                mapView.goTo({
                    target: new Extent({
                        xmin: extent?.xmin,
                        ymin: extent?.ymin,
                        xmax: extent?.xmax,
                        ymax: extent?.ymax,
                        spatialReference: extent?.spatialReference,
                    }),
                });

                // worldImageryUpdatesLayerRef.current
                //     .queryExtent({
                //         where: whereClause,
                //         returnGeometry: true,
                //     })
                //     .then((result) => {
                //         console.log('result:', result);
                //         mapView.goTo({
                //             target: result.extent,
                //         });
                //     })
                //     .catch((error) => {
                //         console.error('Error querying features:', error);
                //     });

                // reset the flag to prevent zooming on subsequent region changes
                dispatch(shouldZoomToSelectedRegionChanged(false));
            } catch (error) {
                // console.error('Error querying extent:', error);

                logger.log('error_querying_extent_for_updates_layer', {
                    category,
                    region,
                    whereClause,
                    error: (error as Error).message,
                });
            } finally {
                dispatch(isLoadingExtentForSelectedRegionChanged(false));
            }
        })();
    }, [
        // worldImageryUpdatesLayerRef.current,
        category,
        region,
        shouldZoomToSelectedRegion,
    ]);

    return null;
};
