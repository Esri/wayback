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

import { useAppDispatch, useAppSelector } from '@store/configureStore';

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
import {
    isSaveAsWebmapDialogOpenSelector,
    isSaveAsWebmapDialogOpenToggled,
} from '@store/UI/reducer';
import { saveReleaseNum4SelectedWaybackItemsInURLQueryParam } from '@utils/UrlSearchParam';
import { isAnimationModeOnSelector } from '@store/AnimationMode/reducer';
import { isAnonymouns, signIn } from '@utils/Esri-OAuth';
import { activeDialogUpdated } from '@store/UI/reducer';

const SaveAsWebmapBtnContainer = () => {
    const dispatch = useAppDispatch();

    // const { userSession, oauthUtils } = useContext(AppContext);

    const rNum4SelectedWaybackItems: number[] = useAppSelector(
        releaseNum4SelectedItemsSelector
    );

    // const isSwipeWidgetOpen: boolean = useAppSelector(
    //     isSwipeWidgetOpenSelector
    // );
    const isAnimationModeOn: boolean = useAppSelector(
        isAnimationModeOnSelector
    );

    const isDisabled = useMemo(() => {
        return (
            // isSwipeWidgetOpen ||
            isAnimationModeOn || rNum4SelectedWaybackItems?.length === 0
        );
    }, [isAnimationModeOn, rNum4SelectedWaybackItems]);

    const isSaveAsWebmapDialogOpen: boolean = useAppSelector(
        isSaveAsWebmapDialogOpenSelector
    );

    const clearAllBtnOnClick = () => {
        dispatch(releaseNum4SelectedItemsCleaned());

        // close the SaveAsWebmapDialog if it's open since there is no selected items
        if (isSaveAsWebmapDialogOpen) {
            dispatch(activeDialogUpdated());
        }
    };

    const onClickHandler = () => {
        if (isDisabled) {
            return;
        }

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
            active={isSaveAsWebmapDialogOpen}
            disabled={isDisabled}
            onClick={onClickHandler}
            clearAll={clearAllBtnOnClick}
        />
    );
};

export default SaveAsWebmapBtnContainer;
