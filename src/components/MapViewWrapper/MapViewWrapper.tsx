import React, {
    useContext
} from 'react';

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

import { AppContext } from '../../contexts/AppContextProvider';
import { isGutterHideSelector } from '../../store/reducers/UI';

const MapViewWrapper = () => {

    const isSwipeWidgetOpen = useSelector(isSwipeWidgetOpenSelector);

    const isGutterHide = useSelector(isGutterHideSelector)

    const { isMobile } = useContext(AppContext)

    const getLeftPosition = ():number =>{

        if(isMobile){
            return isGutterHide ? 0 : GUTTER_WIDTH;
        }

        if(isSwipeWidgetOpen){
            return GUTTER_WIDTH;
        }

        return SIDEBAR_WIDTH + GUTTER_WIDTH;
    }

    return (
        <div
            style={{
                position: 'absolute',
                top: isMobile ? 45 : 0,
                bottom: 0,
                right: 0,
                left: getLeftPosition(),
                display: 'flex'
            }}
        >
            <SwipeWidgetLayerSelector 
                targetLayer='leading'
            />

            <div 
                style={{
                    position: 'relative',
                    flexGrow: 1,
                    flexShrink: 0
                }}
            >
                <MapView />
            </div>
            
            <SwipeWidgetLayerSelector 
                targetLayer='trailing'
            />
            
        </div>
    )
}

export default MapViewWrapper
