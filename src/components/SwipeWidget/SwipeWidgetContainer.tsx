import React, { useCallback, useEffect } from 'react';

import { useSelector, useDispatch, batch } from 'react-redux';

import {
    isSwipeWidgetOpenSelector,
    swipeWidgetLeadingLayerSelector,
    swipeWidgetTrailingLayerSelector,
    swipePositionUpdated,
} from '@store/Swipe/reducer';

import { metadataQueryResultUpdated } from '@store/Map/reducer';

import SwipeWidget from './SwipeWidget';

import { MobileHide } from '../SharedUI';

// import IMapView from 'esri/views/MapView';
import MapView from '@arcgis/core/views/MapView';
import { IWaybackItem } from '@typings/index';
import { saveSwipeWidgetInfoInURLQueryParam } from '@utils/UrlSearchParam';

type Props = {
    mapView?: MapView;
};

const SwipeWidgetContainer: React.FC<Props> = ({ mapView }: Props) => {
    const dispatch = useDispatch();

    const isOpen = useSelector(isSwipeWidgetOpenSelector);

    const waybackItem4LeadingLayer: IWaybackItem = useSelector(
        swipeWidgetLeadingLayerSelector
    );
    const waybackItem4TrailingLayer: IWaybackItem = useSelector(
        swipeWidgetTrailingLayerSelector
    );

    const positionOnChangeHandler = useCallback((position: number) => {
        batch(() => {
            dispatch(swipePositionUpdated(position));
            dispatch(metadataQueryResultUpdated(null));
        });
    }, []);

    useEffect(() => {
        saveSwipeWidgetInfoInURLQueryParam({
            isOpen,
            rNum4SwipeWidgetLeadingLayer: waybackItem4LeadingLayer.releaseNum,
            rNum4SwipeWidgetTrailingLayer: waybackItem4TrailingLayer.releaseNum,
        });
    }, [isOpen, waybackItem4LeadingLayer, waybackItem4TrailingLayer]);

    return (
        <MobileHide>
            <SwipeWidget
                mapView={mapView}
                waybackItem4LeadingLayer={waybackItem4LeadingLayer}
                waybackItem4TrailingLayer={waybackItem4TrailingLayer}
                isOpen={isOpen}
                positionOnChange={positionOnChangeHandler}
            />
        </MobileHide>
    );
};

export default SwipeWidgetContainer;
