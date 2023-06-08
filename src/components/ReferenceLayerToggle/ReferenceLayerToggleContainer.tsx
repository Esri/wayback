import React, { useCallback } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { isAnimationModeOnSelector } from '@store/reducers/AnimationMode';
import {
    isReferenceLayerVisibleSelector,
    isReferenceLayerVisibleToggled,
} from '@store/reducers/Map';
import { MobileHide } from '../SharedUI';

import ReferenceLayerToggle from './ReferenceLayerToggle';

const ReferenceLayerToggleContainer = () => {
    const dispatch = useDispatch();
    const isReferenceLayerVisible = useSelector(
        isReferenceLayerVisibleSelector
    );

    const toggleReferenceLayer = useCallback(() => {
        dispatch(isReferenceLayerVisibleToggled());
    }, []);

    const isAnimationModeOn = useSelector(isAnimationModeOnSelector);

    return (
        <MobileHide>
            {!isAnimationModeOn ? (
                <ReferenceLayerToggle
                    isActive={isReferenceLayerVisible}
                    onClick={toggleReferenceLayer}
                />
            ) : null}
        </MobileHide>
    );
};

export default ReferenceLayerToggleContainer;
