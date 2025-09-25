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

import React, { useMemo } from 'react';

import { useAppDispatch, useAppSelector } from '@store/configureStore';

import {
    isSwipeWidgetOpenSelector,
    toggleSwipeWidget,
} from '@store/Swipe/reducer';

import { metadataQueryResultUpdated, selectMapMode } from '@store/Map/reducer';

// import SwipeWidgetToggleBtn from './SwipeWidgetToggleBtn';
// import MobileHide from '../MobileVisibility/MobileHide';
// import { isAnimationModeOnSelector } from '@store/AnimationMode/reducer';
import { activeDialogSelector } from '@store/UI/reducer';
import { ModeToggleButton } from '@components/ModeToggleButton';

const SwipeWidgetToggleBtnContainer = () => {
    const dispatch = useAppDispatch();

    // const isAnimationModeOn = useAppSelector(isAnimationModeOnSelector);

    // const isSwipeWidgetOpen = useAppSelector(isSwipeWidgetOpenSelector);

    const mode = useAppSelector(selectMapMode);

    const activeDialog = useAppSelector(activeDialogSelector);

    const onClickHandler = () => {
        dispatch(metadataQueryResultUpdated(null));
        dispatch(toggleSwipeWidget());
    };

    const active = useMemo(
        () => mode === 'swipe' && !activeDialog,
        [mode, activeDialog]
    );

    return (
        <ModeToggleButton
            isActive={active}
            tooltip="Toggle Swipe Mode"
            icon="compare"
            testId="swipe-widget-toggle-btn"
            onClick={onClickHandler}
        />
    );
};

export default SwipeWidgetToggleBtnContainer;
