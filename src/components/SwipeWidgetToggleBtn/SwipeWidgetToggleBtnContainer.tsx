import React from 'react';

import { useSelector, useDispatch, batch } from 'react-redux';

import {
    isSwipeWidgetOpenSelector,
    toggleSwipeWidget,
} from '@store/Swipe/reducer';

import { releaseNum4SelectedItemsSelector } from '@store/Wayback/reducer';

import { metadataQueryResultUpdated } from '@store/Map/reducer';

import SwipeWidgetToggleBtn from './SwipeWidgetToggleBtn';
import MobileHide from '../MobileVisibility/MobileHide';
import { isAnimationModeOnSelector } from '@store/AnimationMode/reducer';

const SwipeWidgetToggleBtnContainer = () => {
    const dispatch = useDispatch();

    const isAnimationModeOn = useSelector(isAnimationModeOnSelector);

    const isSwipeWidgetOpen = useSelector(isSwipeWidgetOpenSelector);

    // const rNum4SelectedWaybackItems = useSelector(
    //     releaseNum4SelectedItemsSelector
    // );

    const onClickHandler = () => {
        batch(() => {
            dispatch(metadataQueryResultUpdated(null));
            dispatch(toggleSwipeWidget());
        });
    };

    return (
        <MobileHide>
            <SwipeWidgetToggleBtn
                useDisabledStyle={isAnimationModeOn}
                active={isSwipeWidgetOpen}
                onClickHandler={onClickHandler}
            />
        </MobileHide>
    );
};

export default SwipeWidgetToggleBtnContainer;
