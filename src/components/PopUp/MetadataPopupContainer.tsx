import React from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { isAnimationModeOnSelector } from '@store/AnimationMode/reducer';

import {
    metadataPopupAnchorSelector,
    metadataQueryResultSelector,
    metadataQueryResultUpdated,
} from '@store/Map/reducer';

import MetadataPopUp from './index';

const MetadataPopupContainer = () => {
    const dispatch = useDispatch();

    const metadata = useSelector(metadataQueryResultSelector);

    const anchorPoint = useSelector(metadataPopupAnchorSelector);

    const isAnimationModeOn = useSelector(isAnimationModeOnSelector);

    return !isAnimationModeOn ? (
        <MetadataPopUp
            metadata={metadata}
            metadataAnchorScreenPoint={anchorPoint}
            onClose={() => {
                dispatch(metadataQueryResultUpdated(null));
            }}
        />
    ) : null;
};

export default MetadataPopupContainer;
