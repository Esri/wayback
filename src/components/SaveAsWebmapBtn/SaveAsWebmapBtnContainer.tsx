import React, { useContext, useEffect, useMemo } from 'react';

import { useSelector, useDispatch } from 'react-redux';

import { isSwipeWidgetOpenSelector } from '@store/Swipe/reducer';

import {
    releaseNum4SelectedItemsSelector,
    releaseNum4SelectedItemsCleaned,
} from '@store/Wayback/reducer';

// import { AppContext } from '@contexts/AppContextProvider';

import {
    // saveHashParams,
    setShouldOpenSaveWebMapDialog,
} from '@utils/LocalStorage';

import SaveAsWebmapBtn from './index';
import { isSaveAsWebmapDialogOpenToggled } from '@store/UI/reducer';
import { saveReleaseNum4SelectedWaybackItemsInURLQueryParam } from '@utils/UrlSearchParam';
import { isAnimationModeOnSelector } from '@store/AnimationMode/reducer';
import { isAnonymouns, signIn } from '@utils/Esri-OAuth';

const SaveAsWebmapBtnContainer = () => {
    const dispatch = useDispatch();

    // const { userSession, oauthUtils } = useContext(AppContext);

    const rNum4SelectedWaybackItems: number[] = useSelector(
        releaseNum4SelectedItemsSelector
    );

    const isSwipeWidgetOpen: boolean = useSelector(isSwipeWidgetOpenSelector);
    const isAnimationModeOn: boolean = useSelector(isAnimationModeOnSelector);

    const isDisabled = useMemo(() => {
        return isSwipeWidgetOpen || isAnimationModeOn;
    }, [isSwipeWidgetOpen, isAnimationModeOn]);

    const clearAllBtnOnClick = () => {
        dispatch(releaseNum4SelectedItemsCleaned());
    };

    const onClickHandler = () => {
        if (isAnonymouns()) {
            // set the ShouldOpenSaveWebMapDialog flag in local storage as true, when the app knows to open the dialog after user is signed in
            setShouldOpenSaveWebMapDialog();

            // // save hash params in local storage so the current app state can be restored after sigining in
            // saveHashParams();

            // sign in first before opening the save as web map dialog because the userSession is required to create web map
            signIn();
        } else {
            dispatch(isSaveAsWebmapDialogOpenToggled());
        }
    };

    useEffect(() => {
        saveReleaseNum4SelectedWaybackItemsInURLQueryParam(
            rNum4SelectedWaybackItems
        );
    }, [rNum4SelectedWaybackItems]);

    return (
        <SaveAsWebmapBtn
            selectedWaybackItems={rNum4SelectedWaybackItems}
            disabled={isDisabled}
            onClick={onClickHandler}
            clearAll={clearAllBtnOnClick}
        />
    );
};

export default SaveAsWebmapBtnContainer;
