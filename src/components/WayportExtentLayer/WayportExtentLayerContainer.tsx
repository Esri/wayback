import MapView from '@arcgis/core/views/MapView';
import { useAppDispatch, useAppSelector } from '@store/configureStore';
import {
    selectDownloadJobToShowExtentOnMap,
    // selectDownloadJobToDisplayOnMap,
    selectNewDownloadJob,
} from '@store/DownloadMode/selectors';
import { selectMapMode } from '@store/Map/reducer';
import React, { FC, use, useEffect, useMemo } from 'react';
import { WayportExtentLayer } from './WayportExtentLayer';
import { useSketchViewModel } from './useSketchViewModel';
import { useGetTileEstimations } from './useGetEstimatedTileCount';
import { updateNewDownloadJob } from '@store/DownloadMode/thunks';
import { useRestoreNewWayportJob } from './useRestoreNewWayportJob';

type Props = {
    mapView?: MapView;
};

export const WayportExtentLayerContainer: FC<Props> = ({ mapView }) => {
    const dispatch = useAppDispatch();

    const mode = useAppSelector(selectMapMode);

    const newDownloadJob = useAppSelector(selectNewDownloadJob);

    // Restore the new download job from session storage after sign-in
    // This preserves the job being created if the user needed to authenticate
    useRestoreNewWayportJob();

    const jobToDisplayOnMap = useAppSelector(
        selectDownloadJobToShowExtentOnMap
    );

    // The extent should only be editable if the job is in 'not started' status. Once the job has been started, the extent should be locked in and not editable.
    const extentToEdit = useMemo(() => {
        const currentExtent = newDownloadJob?.extent || null;

        if (mode !== 'wayport') {
            return null;
        }

        if (!currentExtent) {
            return null;
        }

        if (newDownloadJob?.status !== 'not started') {
            return null;
        }

        return currentExtent;
    }, [newDownloadJob?.extent, newDownloadJob?.status, mode]);

    const isSketchVMActive = Boolean(extentToEdit) && mode === 'wayport';

    // The extent to display on the map should be based on the job that is designated to be displayed on the map.
    // This should not be the new download job that is being created, because the  extent of the new download job is handled separately by the sketch view model,
    // and should not be displayed on the map when it's being edited.
    const extentToDisplay = useMemo(() => {
        if (!jobToDisplayOnMap || isSketchVMActive || mode !== 'wayport') {
            return null;
        }

        if (jobToDisplayOnMap.status === 'not started') {
            return null;
        }

        return jobToDisplayOnMap?.extent || null;
    }, [jobToDisplayOnMap, isSketchVMActive, mode]);

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
        isActive: isSketchVMActive,
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

        if (!tileEstimations) {
            return;
        }

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
