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

import React, { useContext, useMemo } from 'react';

import { Gutter } from './index';

import { useAppDispatch, useAppSelector } from '@store/configureStore';

import { isSwipeWidgetOpenSelector } from '@store/Swipe/reducer';

import {
    isShareModalOpenToggled,
    isAboutThisAppModalOpenToggled,
    isSettingModalOpenToggled,
    isGutterHideSelector,
} from '@store/UI/reducer';
import { AppContext } from '@contexts/AppContextProvider';
import { isAnimationModeOnSelector } from '@store/AnimationMode/reducer';
import { copy2clipboard } from '@utils/snippets/copy2clipborad';

type Props = {
    children: React.ReactNode;
};

const GutterContainer: React.FC<Props> = ({ children }) => {
    const dispatch = useAppDispatch();

    const isSwipeWidgetOpen: boolean = useAppSelector(
        isSwipeWidgetOpenSelector
    );
    const isAnimationModeOn: boolean = useAppSelector(
        isAnimationModeOnSelector
    );

    const settingsBtnDisabled = useMemo(() => {
        return isSwipeWidgetOpen || isAnimationModeOn;
    }, [isSwipeWidgetOpen, isAnimationModeOn]);

    const isHide = useAppSelector(isGutterHideSelector);

    const { isMobile } = useContext(AppContext);

    const aboutButtonOnClick = () => {
        dispatch(isAboutThisAppModalOpenToggled());
    };

    const settingButtonOnClick = () => {
        dispatch(isSettingModalOpenToggled());
    };

    const copyButtonOnClick = () => {
        copy2clipboard(window.location.href);
    };

    return !isHide ? (
        <Gutter
            isMobile={isMobile}
            settingsBtnDisabled={settingsBtnDisabled}
            // shareBtnDisabled={onPremises}
            aboutButtonOnClick={aboutButtonOnClick}
            copyButtonOnClick={copyButtonOnClick}
            settingButtonOnClick={settingButtonOnClick}
        >
            {children}
        </Gutter>
    ) : null;
};

export default GutterContainer;
