import MapView from '@arcgis/core/views/MapView';
import { useAppDispatch, useAppSelector } from '@store/configureStore';
import {
    selectDownloadJobToDisplayOnMap,
    selectNewDownloadJob,
} from '@store/DownloadMode/selectors';
import { selectMapMode } from '@store/Map/reducer';
import React, { FC, useEffect, useMemo } from 'react';
import { WayportExtentLayer } from './WayportExtentLayer';
import { useSketchViewModel } from './useSketchViewModel';
import { useGetTileEstimations } from './useGetEstimatedTileCount';
import { updateNewDownloadJob } from '@store/DownloadMode/thunks';

type Props = {
    mapView?: MapView;
};

export const WayportExtentLayerContainer: FC<Props> = ({ mapView }) => {
    const dispatch = useAppDispatch();

    const mode = useAppSelector(selectMapMode);

    const newDownloadJob = useAppSelector(selectNewDownloadJob);

    const jobToDisplayOnMap = useAppSelector(selectDownloadJobToDisplayOnMap);

    // The extent to display on the map should be based on the job that is designated to be displayed on the map.
    // This should not be the new download job that is being created, because the  extent of the new download job is handled separately by the sketch view model, and should not be displayed on the map when it's being edited.
    const extentToDisplay = useMemo(() => {
        if (!jobToDisplayOnMap) {
            return null;
        }

        if (jobToDisplayOnMap.status === 'not started') {
            return null;
        }

        return jobToDisplayOnMap.extent;
    }, [jobToDisplayOnMap]);

    // The extent should only be editable if the job is in 'not started' status. Once the job has been started, the extent should be locked in and not editable.
    const extentToEdit = useMemo(() => {
        const currentExtent = jobToDisplayOnMap?.extent || null;

        if (!currentExtent) {
            return null;
        }

        if (jobToDisplayOnMap?.status !== 'not started') {
            return null;
        }

        return currentExtent;
    }, [jobToDisplayOnMap]);

    const wayportExtentLayerVisibility = useMemo(() => {
        // The layer should only be visible in wayport mode
        if (mode !== 'wayport') return false;

        // if there's no extent to display, we shouldn't show the layer
        if (!extentToDisplay) return false;

        // no need to show the layer if the extent is being edited, as the sketch view model will handle displaying the geometry
        if (extentToEdit) {
            return false;
        }
        return true;
    }, [mode, extentToDisplay, extentToEdit]);

    useSketchViewModel({
        extentToEdit,
        mapView,
        onExtentChange: (updatedExtent) => {
            dispatch(
                updateNewDownloadJob({
                    extent: updatedExtent,
                })
            );
        },
    });

    const { tileEstimations, isGettingEstimations } = useGetTileEstimations({
        releaseNum: newDownloadJob?.waybackItem?.releaseNum || null,
        extent: extentToEdit,
    });

    useEffect(() => {
        // console.log('Tile Estimation Data:', tileEstimations);

        dispatch(
            updateNewDownloadJob({
                tileEstimations,
            })
        );
    }, [tileEstimations]);

    return (
        <WayportExtentLayer
            mapView={mapView}
            extent={extentToDisplay}
            visible={wayportExtentLayerVisibility}
        />
    );
};
