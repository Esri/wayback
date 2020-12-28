import React from 'react';

import {
    useSelector,
    useDispatch,
    batch
} from 'react-redux';

import {
    isSwipeWidgetOpenSelector,
    isSwipeWidgetOpenToggled
} from '../../store/reducers/SwipeView';

import {
    releaseNum4SelectedItemsSelector
} from '../../store/reducers/WaybackItems';

import {
    metadataQueryResultUpdated
} from '../../store/reducers/Map';

import SwipeWidgetToggleBtn from './SwipeWidgetToggleBtn';
import MobileHide from '../SharedUI/MobileHide';

const SwipeWidgetToggleBtnContainer = () => {

    const dispatch = useDispatch();

    const isSwipeWidgetOpen = useSelector(isSwipeWidgetOpenSelector);

    const rNum4SelectedWaybackItems = useSelector(releaseNum4SelectedItemsSelector);

    const onClickHandler = ()=>{
        batch(()=>{
            dispatch(metadataQueryResultUpdated(null))
            dispatch(isSwipeWidgetOpenToggled());
        })
    }

    return (
        <MobileHide>
            <SwipeWidgetToggleBtn 
                isOpen={isSwipeWidgetOpen}
                onClickHandler={onClickHandler}
            />
        </MobileHide>
    )
}

export default SwipeWidgetToggleBtnContainer
