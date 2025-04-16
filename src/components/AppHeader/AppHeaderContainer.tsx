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

import React from 'react';

import { useAppDispatch, useAppSelector } from '@store/configureStore';

import { isGutterHideSelector, isGutterHideToggled } from '@store/UI/reducer';

// import { MobileShow } from '../MobileVisibility';
import MobileHeader from './MobileHeader';
import { IS_MOBILE } from '@constants/UI';
import { AppHeaderText } from './AppHeaderText';

export const AppHeaderContainer = () => {
    const isGutterHide = useAppSelector(isGutterHideSelector);

    const dispatch = useAppDispatch();

    if (IS_MOBILE) {
        return (
            <MobileHeader
                isGutterHide={isGutterHide}
                leftNavBtnOnClick={() => {
                    dispatch(isGutterHideToggled());
                }}
            />
        );
    }

    return (
        <div className="absolute top-0 left-gutter-width h-header-height w-sidebar-width flex items-center justify-center background-theme-blue-diagonal-pattern z-10">
            <AppHeaderText />
        </div>
    );
};
