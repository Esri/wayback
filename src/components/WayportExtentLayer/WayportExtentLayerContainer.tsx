import MapView from '@arcgis/core/views/MapView';
import { useAppSelector } from '@store/configureStore';
import { selectDownloadJobToDisplayOnMap } from '@store/DownloadMode/selectors';
import { selectMapMode } from '@store/Map/reducer';
import React, { FC, useEffect, useMemo } from 'react';
import { WayportExtentLayer } from './WayportExtentLayer';
import { useSketchViewModel } from './useSketchViewModel';
import { useGetTileEstimations } from './useGetEstimatedTileCount';

type Props = {
    mapView?: MapView;
};

export const WayportExtentLayerContainer: FC<Props> = ({ mapView }) => {
    const mode = useAppSelector(selectMapMode);

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
            console.log(
                'Updated extent from useSketchViewModel:',
                updatedExtent
            );
            // Here you can dispatch an action to update the extent in your store
            // For example:
            // dispatch(updateDownloadJobExtent(updatedExtent));
        },
    });

    const { tileEstimationData, isGettingEstimations } = useGetTileEstimations({
        job: jobToDisplayOnMap,
        extent: extentToEdit,
    });

    useEffect(() => {
        console.log('Tile Estimation Data:', tileEstimationData);
    }, [tileEstimationData]);

    return (
        <WayportExtentLayer
            mapView={mapView}
            extent={extentToDisplay}
            visible={visible}
        />
    );
};
