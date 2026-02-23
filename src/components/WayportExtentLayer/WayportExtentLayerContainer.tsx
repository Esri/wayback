import MapView from '@arcgis/core/views/MapView';
import { useAppSelector } from '@store/configureStore';
import { selectDownloadJobToDisplayOnMap } from '@store/DownloadMode/selectors';
import { selectMapMode } from '@store/Map/reducer';
import React, { FC, useMemo } from 'react';
import { WayportExtentLayer } from './WayportExtentLayer';

type Props = {
    mapView?: MapView;
};

export const WayportExtentLayerContainer: FC<Props> = ({ mapView }) => {
    const mode = useAppSelector(selectMapMode);

    const jobToDisplayOnMap = useAppSelector(selectDownloadJobToDisplayOnMap);

    const { extent } = jobToDisplayOnMap || {};

    const visible = useMemo(() => {
        if (mode !== 'wayport') return false;
        if (!extent) return false;
        return true;
    }, [mode, extent]);

    return (
        <WayportExtentLayer
            mapView={mapView}
            extent={extent}
            visible={visible}
        />
    );
};
