import React from 'react';

import { useSelector } from 'react-redux';

import { isReferenceLayerVisibleSelector } from '@store/Map/reducer';

import ReferenceLayer from './ReferenceLayer';
import { getServiceUrl } from '@utils/Tier';
import { isAnimationModeOnSelector } from '@store/AnimationMode/reducer';
import MapView from '@arcgis/core/views/MapView';

type Props = {
    mapView?: MapView;
};

const ReferenceLayerContainer: React.FC<Props> = ({ mapView }: Props) => {
    const isReferenceLayerVisible = useSelector(
        isReferenceLayerVisibleSelector
    );

    const isAnimationModeOn = useSelector(isAnimationModeOnSelector);

    return (
        <ReferenceLayer
            url={getServiceUrl('reference-layer')}
            mapView={mapView}
            isVisible={isReferenceLayerVisible && !isAnimationModeOn}
        />
    );
};

export default ReferenceLayerContainer;
