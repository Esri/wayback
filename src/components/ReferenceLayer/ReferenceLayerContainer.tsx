import React from 'react';

import { useSelector } from 'react-redux';

import { isReferenceLayerVisibleSelector } from '../../store/reducers/Map';

import IMapView from 'esri/views/MapView';

import ReferenceLayer from './ReferenceLayer';
import { getServiceUrl } from '../../utils/Tier';
import { isAnimationModeOnSelector } from '../../store/reducers/AnimationMode';

type Props = {
    mapView?: IMapView;
};

const ReferenceLayerContainer: React.FC<Props> = ({ mapView }: Props) => {
    const isReferenceLayerVisible = useSelector(
        isReferenceLayerVisibleSelector
    );

    const isAnimationModeOn = useSelector(isAnimationModeOnSelector)

    return (
        <ReferenceLayer
            url={getServiceUrl('reference-layer')}
            mapView={mapView}
            isVisible={isReferenceLayerVisible && !isAnimationModeOn}
        />
    );
};

export default ReferenceLayerContainer;
