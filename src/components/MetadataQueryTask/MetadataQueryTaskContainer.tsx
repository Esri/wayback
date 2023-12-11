import React, { useContext } from 'react';

import { useSelector, useDispatch } from 'react-redux';

import { activeWaybackItemSelector } from '@store/Wayback/reducer';

import {
    isSwipeWidgetOpenSelector,
    swipePositionSelector,
    swipeWidgetLeadingLayerSelector,
    swipeWidgetTrailingLayerSelector,
} from '@store/Swipe/reducer';

import {
    metadataQueryResultUpdated,
    metadataPopupAnchorUpdated,
} from '@store/Map/reducer';

import MetadataQueryTask from './MetadataQueryTask';

// import IMapView from 'esri/views/MapView';
import MapView from '@arcgis/core/views/MapView';

type Props = {
    mapView?: MapView;
};

const MetadataQueryTaskContainer: React.FC<Props> = ({ mapView }: Props) => {
    const disptach = useDispatch();

    const activeWaybackItem = useSelector(activeWaybackItemSelector);

    const isSwipeWidgetOpen = useSelector(isSwipeWidgetOpenSelector);
    const swipeWidgetPosition = useSelector(swipePositionSelector);
    const swipeWidgetLeadingLayer = useSelector(
        swipeWidgetLeadingLayerSelector
    );
    const swipeWidgetTrailingLayer = useSelector(
        swipeWidgetTrailingLayerSelector
    );

    return (
        <MetadataQueryTask
            mapView={mapView}
            activeWaybackItem={activeWaybackItem}
            swipeWidgetLeadingLayer={swipeWidgetLeadingLayer}
            swipeWidgetTrailingLayer={swipeWidgetTrailingLayer}
            isSwipeWidgetOpen={isSwipeWidgetOpen}
            swipeWidgetPosition={swipeWidgetPosition}
            metadataOnChange={(metadata) => {
                // console.log(metadata)
                disptach(metadataQueryResultUpdated(metadata));
            }}
            anchorPointOnChange={(anchorPoint) => {
                // console.log(anchorPoint)
                disptach(metadataPopupAnchorUpdated(anchorPoint));
            }}
        />
    );
};

export default MetadataQueryTaskContainer;
