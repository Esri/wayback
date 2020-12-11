import React from 'react';

import {
    useSelector,
    useDispatch,
    batch
} from 'react-redux';

import {
    previewWaybackItemSelector,
    releaseNum4AlternativePreviewWaybackItemSelector
} from '../../store/reducers/WaybackItems';

import TilePreviewWindow from './index';

import IMapView from 'esri/views/MapView';

type Props = {
    mapView?: IMapView;
}

const PreviewWindowContainer:React.FC<Props> = ({
    mapView
}) => {

    const previewWaybackItem = useSelector(previewWaybackItemSelector);

    const releaseNum4AlternativePreviewWaybackItem = useSelector(releaseNum4AlternativePreviewWaybackItemSelector);

    return (
        <TilePreviewWindow
            // no need to show preview window in mobile view, therefore just pass the null as previewWaybackItem
            previewWaybackItem={previewWaybackItem}
            alternativeRNum4RreviewWaybackItem={
                releaseNum4AlternativePreviewWaybackItem
            }
            mapView={mapView}
        />
    )
}

export default PreviewWindowContainer
