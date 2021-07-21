import React from 'react';

import { useSelector } from 'react-redux';

import { isAnimationModeOnSelector, rNum4AnimationFramesSelector } from '../../store/reducers/AnimationMode';

import IMapView from 'esri/views/MapView';

type Props = {
    mapView?: IMapView;
};

import AnimationPanel from './AnimationPanel';

const AnimationPanelContainer:React.FC<Props> = ({
    mapView
}:Props) => {

    const isAnimationModeOn = useSelector(isAnimationModeOnSelector);

    const rNum4AnimationFrames: number[] = useSelector(rNum4AnimationFramesSelector);

    return isAnimationModeOn ? (
        <AnimationPanel 
            releaseNums={rNum4AnimationFrames}
            mapView={mapView}
        />
    ) : null;
}

export default AnimationPanelContainer
