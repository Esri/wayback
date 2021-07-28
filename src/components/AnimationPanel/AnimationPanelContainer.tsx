import React, { useEffect } from 'react';

import { useSelector } from 'react-redux';

import { isAnimationModeOnSelector, waybackItems4AnimationSelector } from '../../store/reducers/AnimationMode';

import IMapView from 'esri/views/MapView';

type Props = {
    mapView?: IMapView;
};

import AnimationPanel from './AnimationPanel';
import { IWaybackItem } from '../../types';

const AnimationPanelContainer:React.FC<Props> = ({
    mapView
}:Props) => {

    const isAnimationModeOn = useSelector(isAnimationModeOnSelector);

    const waybackItems4Animation: IWaybackItem[] = useSelector(waybackItems4AnimationSelector);

    return isAnimationModeOn ? (
        <AnimationPanel 
            waybackItems4Animation={waybackItems4Animation}
            mapView={mapView}
        />
    ) : null;
}

export default AnimationPanelContainer
