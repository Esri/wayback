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

import MapView from '@arcgis/core/views/MapView';
import { useAppDispatch, useAppSelector } from '@store/configureStore';
import {
    selectWayportJobToShowExtentOnMap,
    // selectDownloadJobToDisplayOnMap,
    selectNewWayportJob,
    selectTimestampOfZoomToDownloadJobExtentRequest,
} from '@store/WayportMode/selectors';
import { selectMapMode } from '@store/Map/reducer';
import React, { FC, use, useEffect, useMemo } from 'react';
import { WayportExtentLayer } from './WayportExtentLayer';
// import { useSketchViewModel } from './useSketchViewModel';
import { useGetTileEstimations } from './useGetEstimatedTileCount';
import { updateNewWayportJob } from '@store/WayportMode/thunks';
import { useRestoreNewWayportJob } from './useRestoreNewWayportJob';
import { WayportExtentEditor } from './WayportExtentViewer';

type Props = {
    mapView?: MapView;
};

export const WayportExtentLayerContainer: FC<Props> = ({ mapView }) => {
    const dispatch = useAppDispatch();

    const mode = useAppSelector(selectMapMode);

    const newDownloadJob = useAppSelector(selectNewWayportJob);

    /**
     * Timestamp of when the zoom to download job extent on map request is made.
     */
    const timestampOfZoomToDownloadJobExtentRequest = useAppSelector(
        selectTimestampOfZoomToDownloadJobExtentRequest
    );

    // Restore the new download job from session storage after sign-in
    // This preserves the job being created if the user needed to authenticate
    useRestoreNewWayportJob();

    const jobToDisplayOnMap = useAppSelector(selectWayportJobToShowExtentOnMap);

    // The extent should only be editable if the job is in 'not started' status. Once the job has been started, the extent should be locked in and not editable.
    const extentOfNewDownloadJob = useMemo(() => {
        const currentExtent = newDownloadJob?.extent || null;

        if (mode !== 'wayport') {
            return null;
        }

        if (!currentExtent) {
            return null;
        }

        if (newDownloadJob?.status !== 'wayport job not started') {
            return null;
        }

        return currentExtent;
    }, [newDownloadJob?.extent, newDownloadJob?.status, mode]);

    // const isSketchVMActive = Boolean(extentToEdit) && mode === 'wayport';

    // The extent to display on the map should be based on the job that is designated to be displayed on the map.
    // This should not be the new download job that is being created, because the  extent of the new download job is handled separately by the sketch view model,
    // and should not be displayed on the map when it's being edited.
    const extentToDisplay = useMemo(() => {
        if (
            !jobToDisplayOnMap ||
            extentOfNewDownloadJob ||
            mode !== 'wayport'
        ) {
            return null;
        }

        if (jobToDisplayOnMap.status === 'wayport job not started') {
            return null;
        }

        return jobToDisplayOnMap?.extent || null;
    }, [jobToDisplayOnMap, extentOfNewDownloadJob, mode]);

    const wayportExtentLayerVisibility = useMemo(() => {
        // The layer should only be visible in wayport mode
        if (mode !== 'wayport') return false;

        // if there's no extent to display, we shouldn't show the layer
        if (!extentToDisplay) return false;

        // no need to show the layer if the extent is being edited, as the sketch view model will handle displaying the geometry
        if (extentOfNewDownloadJob) {
            return false;
        }

        return true;
    }, [mode, extentToDisplay, extentOfNewDownloadJob]);

    // useSketchViewModel({
    //     isActive: isSketchVMActive,
    //     extentToEdit,
    //     mapView,
    //     timestampOfZoomToDownloadJobExtentRequest,
    //     onExtentChange: (updatedExtent) => {
    //         dispatch(
    //             updateNewDownloadJob({
    //                 extent: updatedExtent,
    //             })
    //         );
    //     },
    // });

    const { tileEstimations, isGettingEstimations } = useGetTileEstimations({
        releaseNum: newDownloadJob?.waybackItem?.releaseNum || null,
        extent: extentOfNewDownloadJob,
    });

    useEffect(() => {
        // console.log('Tile Estimation Data:', tileEstimations);

        if (!tileEstimations) {
            return;
        }

        dispatch(
            updateNewWayportJob({
                tileEstimations,
            })
        );
    }, [tileEstimations]);

    // if the mode is wayport and there's a new download job with an extent,
    // show the extent viewer which allows the user to edit the extent.
    // Otherwise, show the wayport extent layer which just displays the extent without editing capabilities.
    if (mode === 'wayport' && newDownloadJob && extentOfNewDownloadJob) {
        return (
            <WayportExtentEditor
                mapView={mapView}
                extent={extentOfNewDownloadJob}
                onExtentChange={({ extent, zoomLevel }) => {
                    dispatch(
                        updateNewWayportJob({
                            extent,
                            zoomLevelOfMapWhenCreatingOrUpdatingExtent:
                                zoomLevel,
                        })
                    );
                }}
            />
        );
    }

    return (
        <WayportExtentLayer
            mapView={mapView}
            extent={extentToDisplay}
            visible={wayportExtentLayerVisibility}
            timestampOfZoomToDownloadJobExtentRequest={
                timestampOfZoomToDownloadJobExtentRequest
            }
        />
    );
};
