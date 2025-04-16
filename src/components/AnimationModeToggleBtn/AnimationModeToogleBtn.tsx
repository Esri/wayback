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

const AnimationModeToogleBtn = () => {
    const dispatch = useAppDispatch();

    const { isMobile } = useContext(AppContext);

    const mode = useAppSelector(selectMapMode);

    // const isAnimationModeOn = useAppSelector(isAnimationModeOnSelector);

    // // if swipe widget is on, the animation button should be set to semi-transparent
    // const isSwipeWidgetOpen = useAppSelector(isSwipeWidgetOpenSelector);

    const isActive = useMemo(() => {
        return mode === 'animation';
    }, [mode]);

    const onClickHandler = useCallback(() => {
        dispatch(toggleAnimationMode());
    }, []);

    return !isMobile ? (
        <div
            className={classnames(
                'relative w-full cursor-pointer py-2 text-center flex items-center justify-center',
                {
                    'opacity-50': !isActive,
                    'text-white': isActive,
                    'bg-custom-background': isActive,
                }
            )}
            // style={{
            //     height: 50,
            //     width: '100%',
            //     cursor: 'pointer',
            //     display: 'flex',
            //     justifyContent: 'center'
            // }}
            onClick={onClickHandler}
            title="Toggle Animate Mode"
        >
            {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" height="32" width="32">
                <path d="M12 9.523v12.954l9.5-6.476zm1 1.892l6.725 4.586L13 20.585zM2 5v22h28V5zm27 21H3V6h26z"/><path fill="none" d="M0 0h32v32H0z"/>
            </svg> */}
            <calcite-icon icon="play" scale="l" />
        </div>
    ) : null;
};

export default AnimationModeToogleBtn;
