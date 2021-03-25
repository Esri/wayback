import React, { useCallback } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import {
    isReferenceLayerVisibleSelector,
    isReferenceLayerVisibleToggled,
} from '../../store/reducers/Map';
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

    return (
        <MobileHide>
            <ReferenceLayerToggle
                isActive={isReferenceLayerVisible}
                onClick={toggleReferenceLayer}
            />
        </MobileHide>
    );
};

export default ReferenceLayerToggleContainer;
