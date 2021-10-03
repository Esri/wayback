import React, { useEffect } from 'react';

import { useSelector } from 'react-redux';

import { activeWaybackItemSelector } from '../../store/reducers/WaybackItems';
import { saveReleaseNum4ActiveWaybackItemInURLQueryParam } from '../../utils/UrlSearchParam';

import WaybackLayer from './WaybackLayer';

// import IMapView from 'esri/views/MapView';
import MapView from '@arcgis/core/views/MapView';

type Props = {
    mapView?: MapView;
};

const WaybackLayerContainer: React.FC<Props> = ({ mapView }: Props) => {
    const activeWaybackItem = useSelector(activeWaybackItemSelector);

    useEffect(() => {
        saveReleaseNum4ActiveWaybackItemInURLQueryParam(
            activeWaybackItem.releaseNum
        );
    }, [activeWaybackItem]);

    return (
        <WaybackLayer mapView={mapView} activeWaybackItem={activeWaybackItem} />
    );
};

export default WaybackLayerContainer;
