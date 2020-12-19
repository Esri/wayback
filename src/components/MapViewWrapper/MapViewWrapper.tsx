import React from 'react';

import {
    useSelector,
    useDispatch,
    batch
} from 'react-redux';

import{
    isSwipeWidgetOpenSelector,
} from '../../store/reducers/SwipeView';

import MapView from '../MapView/MapViewConatiner';

import SwipeWidgetLayerSelector from '../SwipeWidgetLayerSelector/SwipeWidgetLayerSelectorContainer';

import {
    SIDEBAR_WIDTH,
    GUTTER_WIDTH
} from '../../constants/UI'

const MapViewWrapper = () => {

    const isSwipeWidgetOpen = useSelector(isSwipeWidgetOpenSelector);

    const getLeftPosition = ():number =>{

        if(isSwipeWidgetOpen){
            return GUTTER_WIDTH;
        }

        return SIDEBAR_WIDTH + GUTTER_WIDTH;
    }

    return (
        <div
            style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                right: 0,
                left: getLeftPosition(),
                display: 'flex'
            }}
        >

            <div 
                style={{
                    position: 'relative',
                    flexGrow: 1,
                    flexShrink: 0
                }}
            >
                <SwipeWidgetLayerSelector 
                    targetLayer='leading'
                />

                <MapView />

                <SwipeWidgetLayerSelector 
                    targetLayer='trailing'
                />
            </div>
            
            
        </div>
    )
}

export default MapViewWrapper
