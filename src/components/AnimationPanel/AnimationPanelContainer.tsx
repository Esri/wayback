import React from 'react';

import { useSelector } from 'react-redux';

import { isAnimationModeOnSelector } from '../../store/reducers/AnimationMode';

import IMapView from 'esri/views/MapView';

type Props = {
    mapView?: IMapView;
};

import AnimationPanel from './AnimationPanel';

const AnimationPanelContainer:React.FC<Props> = ({
    mapView
}:Props) => {

    const isAnimationModeOn = useSelector(isAnimationModeOnSelector);

    return isAnimationModeOn ? (
        <AnimationPanel 
            releaseNums={[]}
            mapView={mapView}
        />
    ) : null;
}

export default AnimationPanelContainer
