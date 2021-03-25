import React from 'react';

import { useSelector, useDispatch } from 'react-redux';

import {
    metadataPopupAnchorSelector,
    metadataQueryResultSelector,
    metadataQueryResultUpdated,
} from '../../store/reducers/Map';

import MetadataPopUp from './index';

const MetadataPopupContainer = () => {
    const dispatch = useDispatch();

    const metadata = useSelector(metadataQueryResultSelector);

    const anchorPoint = useSelector(metadataPopupAnchorSelector);

    return (
        <MetadataPopUp
            metadata={metadata}
            metadataAnchorScreenPoint={anchorPoint}
            onClose={() => {
                dispatch(metadataQueryResultUpdated(null));
            }}
        />
    );
};

export default MetadataPopupContainer;
