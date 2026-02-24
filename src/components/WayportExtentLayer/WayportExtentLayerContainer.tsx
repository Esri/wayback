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

    const extentToDisplay = jobToDisplayOnMap?.extent || null;

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

    const visible = useMemo(() => {
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
            visible={visible}
        />
    );
};
