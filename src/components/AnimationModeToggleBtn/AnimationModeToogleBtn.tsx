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

// import './AnimationModeToogleBtn.css';
import React, { useCallback, useContext, useMemo } from 'react';

import classnames from 'classnames';

import { useAppDispatch, useAppSelector } from '@store/configureStore';

import {
    isAnimationModeOnSelector,
    toggleAnimationMode,
} from '@store/AnimationMode/reducer';
import { AppContext } from '@contexts/AppContextProvider';
import { isSwipeWidgetOpenSelector } from '@store/Swipe/reducer';
import { selectMapMode } from '@store/Map/reducer';
import { ModeToggleButton } from '@components/ModeToggleButton';
import { activeDialogSelector } from '@store/UI/reducer';

const AnimationModeToogleBtn = () => {
    const dispatch = useAppDispatch();

    const { isMobile } = useContext(AppContext);

    const mode = useAppSelector(selectMapMode);

    // const isAnimationModeOn = useAppSelector(isAnimationModeOnSelector);

    // // if swipe widget is on, the animation button should be set to semi-transparent
    // const isSwipeWidgetOpen = useAppSelector(isSwipeWidgetOpenSelector);

    const activeDialog = useAppSelector(activeDialogSelector);

    const isActive = useMemo(() => {
        return mode === 'animation' && !activeDialog;
    }, [mode, activeDialog]);

    const onClickHandler = useCallback(() => {
        dispatch(toggleAnimationMode());
    }, []);

    return !isMobile ? (
        <ModeToggleButton
            isActive={isActive}
            tooltip="Toggle Animation Mode"
            icon="play"
            testId="animation-mode-toggle-btn"
            onClick={onClickHandler}
        />
    ) : // <div
    null;
};

export default AnimationModeToogleBtn;
