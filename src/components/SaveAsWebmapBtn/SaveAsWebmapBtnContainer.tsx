/* Copyright 2024 Esri
 *
 * Licensed under the Apache License Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
        return (
            isSwipeWidgetOpen ||
            isAnimationModeOn ||
            rNum4SelectedWaybackItems?.length === 0
        );
    }, [isSwipeWidgetOpen, isAnimationModeOn, rNum4SelectedWaybackItems]);

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
