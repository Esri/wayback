import React, { useContext, useEffect } from 'react';

import {
    useSelector,
    // useDispatch,
    // batch
} from 'react-redux';

import {
    previewWaybackItemSelector,
    releaseNum4AlternativePreviewWaybackItemSelector,
} from '../../store/reducers/WaybackItems';

// import TilePreviewWindow from './index';
import PreviewWindow from './PreviewWindow';

import MapView from '@arcgis/core/views/MapView';
import { AppContext } from '../../contexts/AppContextProvider';

type Props = {
    mapView?: MapView;
};

const PreviewWindowContainer: React.FC<Props> = ({ mapView }: Props) => {
    const { isMobile } = useContext(AppContext);

    const previewWaybackItem = useSelector(previewWaybackItemSelector);

    const releaseNum4AlternativePreviewWaybackItem = useSelector(
        releaseNum4AlternativePreviewWaybackItemSelector
    );

    if (isMobile) {
        return null;
    }

    return (
        <PreviewWindow
            previewWaybackItem={previewWaybackItem}
            alternativeRNum4RreviewWaybackItem={
                releaseNum4AlternativePreviewWaybackItem
            }
            mapView={mapView}
        />
    );
};

export default PreviewWindowContainer;
