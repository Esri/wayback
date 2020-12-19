import React, { useCallback } from 'react';

import {
    useSelector,
    useDispatch,
    batch
} from 'react-redux';

import{
    isSwipeWidgetOpenSelector,
    swipeWidgetLeadingLayerSelector,
    swipeWidgetTrailingLayerSelector,
    swipePositionUpdated
} from '../../store/reducers/SwipeView';

import{
    metadataQueryResultUpdated
} from '../../store/reducers/Map';

import SwipeWidget from './SwipeWidget';

import {
    MobileHide
} from '../SharedUI';

import IMapView from 'esri/views/MapView';
import { IWaybackItem } from '../../types';

type Props = {
    mapView?: IMapView;
}

const SwipeWidgetContainer:React.FC<Props> = ({
    mapView
}) => {

    const dispatch = useDispatch();

    const isOpen = useSelector(isSwipeWidgetOpenSelector);

    const waybackItem4LeadingLayer: IWaybackItem = useSelector(swipeWidgetLeadingLayerSelector);
    const waybackItem4TrailingLayer: IWaybackItem = useSelector(swipeWidgetTrailingLayerSelector);

    const positionOnChangeHandler = useCallback((position:number)=>{

        batch(()=>{
            dispatch(swipePositionUpdated(position));
            dispatch(metadataQueryResultUpdated(null));
        })

    }, []);

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
    )
}

export default SwipeWidgetContainer
