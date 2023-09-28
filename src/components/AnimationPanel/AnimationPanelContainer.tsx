import React, { useEffect } from 'react';

import { useSelector } from 'react-redux';

import {
    isAnimationModeOnSelector,
    waybackItems4AnimationSelector,
} from '@store/AnimationMode/reducer';

// import IMapView from 'esri/views/MapView';

import AnimationPanel from './AnimationPanel';
import { IWaybackItem } from '@typings/index';
import MapView from '@arcgis/core/views/MapView';

type Props = {
    mapView?: MapView;
};

const AnimationPanelContainer: React.FC<Props> = ({ mapView }: Props) => {
    const isAnimationModeOn = useSelector(isAnimationModeOnSelector);

    const waybackItems4Animation: IWaybackItem[] = useSelector(
        waybackItems4AnimationSelector
    );

    return isAnimationModeOn && waybackItems4Animation.length ? (
        <AnimationPanel
            waybackItems4Animation={waybackItems4Animation}
            mapView={mapView}
        />
    ) : null;
};

export default AnimationPanelContainer;
